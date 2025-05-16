import React from "react";
import { noUserImg } from "../../utils/noUser";

const ProfileCard = ({ data }) => {
  let roles = ["Public", "Member", "Employee", "Admin"];
  return (
    <div className="w-full max-w-sm dark:text-white bg-gray-200 text-center border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
      <div className="w-fit relative text-center mx-auto pt-7">
        <img
          src={noUserImg}
          className="rounded-full shadow-lg mx-auto cursor-pointer block object-cover w-20 h-20"
          width={80}
          height={80}
          alt="profile picture"
        />
        <h3 className="font-bold text-md mb-0 mt-2">{data?.username}</h3>
        <p className="text-sm text-gray-500 dark:text-white">
          {roles[data?.user_type - 1]}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-md p-2 mt-1 pl-4">
        <ul className="max-w-md space-y-2 text-blue-900 text-sm font-semibold list-inside dark:text-white">
          <li className="flex items-center">
            <img
              src="/svgs/Person-1Blue.svg"
              width={16}
              height={16}
              className="fill-blue-900 me-2"
            />
            Probe {roles[data?.user_type - 1]}
          </li>
          <li className="flex items-center">
            <img
              src="/svgs/mail.svg"
              width={16}
              height={16}
              className="fill-blue-900 me-2"
            />
            {data?.email}
          </li>
          <li className="flex items-center">
            <img
              src="/svgs/calender.svg"
              width={16}
              height={16}
              className="fill-blue-900 me-2"
            />
            Mughal pura Lahore
          </li>
          <li className="flex items-center">
            <img
              src="/svgs/birthday.svg"
              width={16}
              height={16}
              className="fill-blue-900 me-2"
            />
            25 March, 1996
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileCard;
