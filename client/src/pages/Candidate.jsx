import React from 'react';
import Navigation from "./Navigation";
import { toast } from 'sonner';

const Candidate = ({ state, handleCase }) => {
  const handleInfo = async (event) => {
    event.preventDefault();

    const candidatesInfo = {
      name: handleCase(document.querySelector("#name").value),
      party: document.querySelector("#party").value.toUpperCase(),
      age: document.querySelector("#age").value,
      gender: handleCase(document.querySelector("#gender").value),
    };

    try {
      await state.contract.candidateRegister.send(
        candidatesInfo.name,
        candidatesInfo.party,
        candidatesInfo.age,
        candidatesInfo.gender
      );
      toast.success(`Candidate ${candidatesInfo.name} registered successfully`);
    } catch (error) {
      console.error(error);
      toast.error(error.reason || "Registration failed");
    }
  };

  return (
    <div className="flex h-full space-x-32">
      <Navigation />
      <div className="w-3/5 h-4/5">
        <div className="flex flex-col justify-center items-center mt-10">
          <h1 className="mb-10 text-2xl text-gray-600 dark:text-gray-400">
            Candidate Registration
          </h1>

          {/* Form starts */}
          <form
            className="grid grid-rows-2 grid-flow-col gap-7"
            onSubmit={handleInfo}
          >
            <div className="grid grid-rows-4 grid-flow-col gap-10">
              <div className="w-full rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-lg">
                <input
                  id="name"
                  placeholder="Enter name"
                  className="w-full h-10 p-6 rounded-[calc(1.5rem-1px)] bg-white dark:bg-gray-900 dark:text-slate-200"
                />
              </div>

              <div className="w-full rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-lg">
                <input
                  id="party"
                  placeholder="Enter party"
                  className="w-full h-10 p-6 rounded-[calc(1.5rem-1px)] bg-white dark:bg-gray-900 dark:text-slate-200"
                />
              </div>

              <div className="w-full rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-lg">
                <input
                  id="age"
                  placeholder="Enter age"
                  className="w-full h-10 p-6 rounded-[calc(1.5rem-1px)] bg-white dark:bg-gray-900 dark:text-slate-200"
                />
              </div>

              <div className="w-full rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-lg">
                <input
                  id="gender"
                  placeholder="Enter gender"
                  className="w-full h-10 p-6 rounded-[calc(1.5rem-1px)] bg-white dark:bg-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="w-full rounded-3xl p-px">
              <button
                type="submit"
                className="relative inline-flex ml-32 items-center justify-center p-0.5 rounded-full mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-200 shadow-lg"
              >
                <span className="relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 transition-all duration-700">
                  Register
                </span>
              </button>
            </div>
          </form>
          {/* Form ends */}
        </div>
      </div>
    </div>
  );
};

export default Candidate;
