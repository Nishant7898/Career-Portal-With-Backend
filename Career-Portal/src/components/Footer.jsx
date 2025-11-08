import React from "react";

const Footer = () => {
  return (
    <div className="flex h-[100px] justify-center items-center">
      <footer className="  h-full     bg-blue-800  w-full">
        <div className="flex flex-row py-10 items-center text-white justify-between px-10">
          <p>Career Portal All rights reserved. </p>
          <div className="flex gap-5 ">
            <p>About </p>
            <p>Contact </p>
            <p>Privacy </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
