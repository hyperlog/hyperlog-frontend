import React from "react";
import logo from "../logo.svg";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import PulseLoader from "react-spinners/PulseLoader";

const RegisterPage = () => {
  let history = useHistory();

  const MUTATION_USER_REGISTRATION = gql`
    mutation(
      $email: String!
      $f_name: String!
      $l_name: String!
      $password: String!
      $username: String!
    ) {
      register(
        email: $email
        firstName: $f_name
        lastName: $l_name
        password: $password
        username: $username
      ) {
        success
        errors
      }
    }
  `;

  const [
    registerUser,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(MUTATION_USER_REGISTRATION, {
    onError: (err) => console.log(err),
  });

  const NORMAL_INPUT_CLASS =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5";
  const ERROR_INPUT_CLASS =
    "appearance-none block w-full px-3 py-2 border border-red-300 rounded-md text-red-900 placeholder-red-300  focus:outline-none focus:border-red-300 focus:shadow-outline-red transition duration-150 ease-in-out sm:text-sm sm:leading-5";

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(20).required("Required"),
      lastName: Yup.string().max(20).required("Required"),
      username: Yup.string().max(15).required("Required"),
      password: Yup.string().required("Required"),
      email: Yup.string().email("Invalid Email Provided").required("Required"),
    }),
    onSubmit: (values) => {
      registerUser({
        variables: {
          email: values.email,
          f_name: values.firstName,
          l_name: values.lastName,
          password: values.password,
          username: values.username,
        },
      }).then((res) => {
        if (res.data.register.success)
          setTimeout(() => history.push("/login"), 4000);
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src={logo} alt="Hyperlog" />
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mutationError ? (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm leading-5 font-medium text-red-800">
                    Invalid Credentials Provided
                  </h3>
                </div>
              </div>
            </div>
          ) : null}

          {mutationData && mutationData.register.errors ? (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm leading-5 font-medium text-red-800">
                    There were {mutationData.register.errors.length} errors with
                    your submission
                  </h3>
                  <div className="mt-2 text-sm leading-5 text-red-700">
                    <ul className="list-disc pl-5">
                      {mutationData.register.errors.forEach((err) => (
                        <li className="mt-1">{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {mutationData && mutationData.register.success ? (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm leading-5 font-medium text-green-800">
                    Registered Successfully!
                  </h3>
                  <div className="mt-2 text-sm leading-5 text-green-700">
                    <p>
                      You have been registered successfully! You will be
                      redirected to login in a few seconds.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        to="/login"
                        className="px-2 py-1.5 rounded-md text-sm leading-5 font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:bg-green-100 transition ease-in-out duration-150"
                      >
                        Take me there now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <form onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={
                    formik.touched.email && formik.errors.email
                      ? ERROR_INPUT_CLASS
                      : NORMAL_INPUT_CLASS
                  }
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Name
              </label>
              <div className="mt-1 rounded-md shadow-sm flex">
                <div className="w-1/2 relative flex-1 min-w-0">
                  <input
                    placeholder="First Name"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-label="First Name"
                    className={
                      formik.touched.firstName && formik.errors.firstName
                        ? "appearance-none relative px-3 py-2 block w-full rounded-none rounded-bl-md rounded-tl-md border border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-300 focus:shadow-outline-red transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        : "appearance-none relative px-3 py-2 block w-full rounded-none rounded-bl-md rounded-tl-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    }
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : null}
                </div>
                <div className="-ml-px relative flex-1 min-w-0">
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    aria-label="Last Name"
                    className={
                      formik.touched.firstName && formik.errors.firstName
                        ? "appearance-none relative px-3 py-2 block w-full rounded-none rounded-br-md rounded-tr-md border border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:border-red-300 focus:shadow-outline-red transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        : "appearance-none relative px-3 py-2 block w-full rounded-none rounded-br-md rounded-tr-md border border-gray-300 placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    }
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="username"
                  type="text"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={
                    formik.touched.username && formik.errors.username
                      ? ERROR_INPUT_CLASS
                      : NORMAL_INPUT_CLASS
                  }
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
              {formik.touched.username && formik.errors.username ? (
                <p className="mt-2 text-sm text-red-600" id="username-error">
                  {formik.errors.username}
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  type="password"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={
                    formik.touched.password && formik.errors.password
                      ? ERROR_INPUT_CLASS
                      : NORMAL_INPUT_CLASS
                  }
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition duration-150 ease-in-out"
                >
                  {mutationLoading ? (
                    <PulseLoader size="10" color="#ffffff" />
                  ) : (
                    "Register"
                  )}
                </button>
              </span>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm leading-5">
                <span className="px-2 bg-white text-gray-500">
                  Already have an Account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-50 focus:outline-none focus:border-gray-300 focus:shadow-outline-gray active:bg-gray-200 transition ease-in-out duration-150"
                >
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
