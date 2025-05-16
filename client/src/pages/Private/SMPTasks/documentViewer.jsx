import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import WebViewer from "@pdftron/webviewer";
import {
  smpTaskApi,
  useGetDocumentPreviewQuery,
  useSaveDocContentMutation,
} from "../../../apis/SMPTask/smp-task";
import { SpinnerSm } from "../../../components/Spinner";
import DataInfo from "../../../components/DataInfo";
import { errorMessages } from "../../../apis/messageHandler";
import toast from "react-hot-toast";
import { generateS3FilePath } from "../../../utils/files";
import { useDispatch } from "react-redux";

export const DocumentDialog = ({
  open = false,
  onClose = () => {},
  fileUrl = "",
  taskId = "",
}) => {
  const viewerRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState("");

  const {
    data: blob,
    error,
    isFetching: loadingDoc,
  } = useGetDocumentPreviewQuery(
    { key: fileUrl },
    { skip: !open || !fileUrl || !fileUrl?.trim().endsWith(".docx") }
  );
  const [updateFile, { isLoading: isSaving }] = useSaveDocContentMutation();

  useEffect(() => {
    if (!open || !fileUrl) return;

    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    setFileType(fileExtension);
    setLoading(true);

    if (fileExtension === "pdf") {
      setLoading(false);
      return;
    }

    if (fileExtension === "docx" && viewerRef.current) {
      const initializeWebViewer = async () => {
        try {
          const file = new File([blob], "document.docx", {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const blobUrl = URL.createObjectURL(file);
          const viewerInstance = await WebViewer(
            {
              path: "/lib/webviewer",
              initialDoc: blobUrl,
              enableOfficeEditing: true,
              // fullAPI: true,
              custom: {
                disableWebsockets: true,
              },
              extension: "docx",
              ui: {
                hideLeftPanel: true, // This hides the left sidebar
                hideHeader: true, // This hides the header (including the top-right menu)
              },
            },
            viewerRef.current
          );

          setInstance(viewerInstance);
          setLoading(false);
        } catch (err) {
          console.error("Failed to initialize WebViewer:", err);
          setLoading(false);
        }
      };

      initializeWebViewer();
    }
    // return () => {
    //   URL.revokeObjectURL();
    // };
  }, [open, fileUrl, blob]);
  const dispatch = useDispatch();
  const handleSave = async () => {
    if (!instance) return;

    try {
      setLoading(true);
      const { documentViewer, annotationManager } = instance.Core;
      const doc = documentViewer.getDocument(); // Get the document object

      if (!doc) {
        throw new Error("Document is not loaded properly");
      }

      // Export annotations to XFDF
      const xfdfString = await annotationManager.exportAnnotations();

      // Merge annotations back into the DOCX document
      const fileData = await doc.getFileData({ xfdfString });

      // Convert the merged file into a Blob
      const fileBlob = new Blob([fileData], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Prepare FormData for uploading
      const formData = new FormData();
      formData.append("file", fileBlob); // Add the updated DOCX file

      // Send the updated DOCX file to the server
      await updateFile({ task: taskId, formData });

      toast.success("Document saved successfully!");
      dispatch(
        smpTaskApi.util.invalidateTags([
          { type: "DocumentPreview", id: fileUrl },
        ])
      );
      setInstance(null);
      setFileType("");
      onClose();
    } catch (error) {
      errorMessages(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Document Viewer & Editor</DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#fff", p: 0 }}>
        {loadingDoc ? (
          <SpinnerSm isPage={true} />
        ) : error ? (
          <DataInfo message={error?.message || "Failed to load document"} />
        ) : fileType === "pdf" ? (
          <iframe
            src={generateS3FilePath(fileUrl)}
            title="PDF Viewer"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        ) : (
          <div
            ref={viewerRef}
            style={{
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        {fileType === "docx" && instance && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || isSaving}
          >
            {loading ? "Wait..." : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
