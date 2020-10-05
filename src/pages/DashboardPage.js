import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import UserLayout from "../layout/UserLayout";
import { refreshUser } from "../utils/auth";
import { BeatLoader } from "react-spinners";
import SetUserInfoStep from "../components/SetUserInfoStep";
import ProfileInfo from "../components/ProfileInfo";
import ComingSoon from "../components/ComingSoon";

const GET_USER_POLL = gql`
  query {
    thisUser {
      id
      firstName
      lastName
      username
      email
      newUser
      showAvatar
      themeCode
      socialLinks
      setupStep
      tagline
      underConstruction
      profiles {
        id
        accessToken
      }
      stackOverflow {
        id
      }
    }
  }
`;

const MUTATION_MAKE_PUBLIC = gql`
  mutation {
    markPortfolioAsConstructed {
      success
    }
  }
`;

const SELECTED_MENU_ITEM =
  "group flex items-center px-3 w-full py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150";

const NORMAL_MENU_ITEM =
  "mt-1 group flex items-center px-3 w-full py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition ease-in-out duration-150";

const SELECTED_MENU_ICON =
  "flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150";

const NORMAL_MENU_ICON =
  "flex-shrink-0 -ml-1 mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { loading, data, startPolling, stopPolling } = useQuery(GET_USER_POLL);

  const [portfolioConstructed, setPortfolioConstructed] = useState(
    !user.underConstruction
  );

  const [showPublicAvailability, setShowPublicAvailability] = useState(
    user.underConstruction
  );

  const [selectedItem, setSelectedItem] = useState("info");

  const [markAsConstructed, { loading: constructionLoading }] = useMutation(
    MUTATION_MAKE_PUBLIC,
    {
      onCompleted: (data) => {
        if (data.markPortfolioAsConstructed.success) {
          setPortfolioConstructed(true);
        }
      },
    }
  );

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (!loading && JSON.parse(localStorage.getItem("user")) !== data.thisUser) {
    refreshUser(data.thisUser);
  }

  return (
    <>
      <UserLayout
        header={user.profiles.length === 0 ? `One more step...` : "Dashboard"}
      >
        {showPublicAvailability ? (
          <div
            className={`bg-gradient-to-br ${
              portfolioConstructed && !constructionLoading
                ? "to-teal-300 from-green-500"
                : "to-orange-300 from-yellow-300"
            } overflow-hidden shadow-lg sm:rounded-lg mb-8 transition-all ease-in-out duration-700`}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-10 gap-1">
                <span className="text-white col-span-9">
                  {portfolioConstructed ? (
                    <>
                      This portfolio is now publicly available. Head over to{" "}
                      <a href={`https://${user.username}.hyperlog.dev`}>
                        {user.username}.hyperlog.dev
                      </a>{" "}
                      to view it now.
                    </>
                  ) : constructionLoading ? (
                    <BeatLoader color="#ffffff" size="10px" />
                  ) : (
                    "Make your website public to the world now! Just toggle this switch"
                  )}
                </span>
                <span
                  role="checkbox"
                  tabindex="0"
                  aria-checked="false"
                  onClick={() => {
                    if (!portfolioConstructed) {
                      setPortfolioConstructed(true);
                      markAsConstructed();
                      setTimeout(() => {
                        setShowPublicAvailability(false);
                      }, 5000);
                    }
                  }}
                  class="col-span-1 group relative inline-flex items-center justify-center flex-shrink-0 h-5 w-10 cursor-pointer focus:outline-none"
                >
                  <span
                    aria-hidden="true"
                    class={`${
                      portfolioConstructed ? "bg-green-100" : "bg-cool-gray-100"
                    } absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200`}
                  ></span>
                  <span
                    aria-hidden="true"
                    class={`${
                      portfolioConstructed ? "translate-x-5" : "translate-x-0"
                    } absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform group-focus:shadow-outline-gray group-focus:border-green-300 transition-transform ease-in-out duration-200`}
                  ></span>
                </span>
              </div>
            </div>
          </div>
        ) : null}
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <div className="md:col-span-1">
            <nav>
              <button
                onClick={() => setSelectedItem("dashboard")}
                className={
                  selectedItem === "dashboard"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
                aria-current="page"
              >
                <svg
                  className={
                    selectedItem === "dashboard"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="truncate">Dashboard</span>
              </button>
              <button
                onClick={() => setSelectedItem("info")}
                className={
                  selectedItem === "info"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
              >
                <svg
                  className={
                    selectedItem === "info"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
                <span className="truncate">User Info</span>
              </button>
              <button
                onClick={() => setSelectedItem("projects")}
                className={
                  selectedItem === "projects"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
              >
                <svg
                  className={
                    selectedItem === "projects"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span className="truncate">Projects</span>
              </button>
              <button
                onClick={() => setSelectedItem("blogs")}
                className={
                  selectedItem === "blogs"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
              >
                <svg
                  className={
                    selectedItem === "blogs"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="truncate">Blogs</span>
              </button>
              <button
                onClick={() => setSelectedItem("contacts")}
                className={
                  selectedItem === "contacts"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
              >
                <svg
                  className={
                    selectedItem === "contacts"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="truncate">Contacts</span>
              </button>
              <button
                onClick={() => setSelectedItem("settings")}
                className={
                  selectedItem === "settings"
                    ? SELECTED_MENU_ITEM
                    : NORMAL_MENU_ITEM
                }
              >
                <svg
                  className={
                    selectedItem === "settings"
                      ? SELECTED_MENU_ICON
                      : NORMAL_MENU_ICON
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">Settings</span>
              </button>
            </nav>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-3">
            {selectedItem === "dashboard" && <ComingSoon />}
            {selectedItem === "info" && (
              <SetUserInfoStep user={user} dashboard={true} />
            )}
            {selectedItem === "projects" && <ProfileInfo setupMode={true} />}
            {selectedItem === "blogs" && <ComingSoon />}
            {selectedItem === "contacts" && <ComingSoon />}
            {selectedItem === "settings" && <ComingSoon />}
          </div>
        </div>
      </UserLayout>
    </>
  );
};

export default DashboardPage;
