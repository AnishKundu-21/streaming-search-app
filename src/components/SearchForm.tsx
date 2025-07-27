import { FormEvent } from "react";

interface SearchFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function SearchForm({ onSubmit }: SearchFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Find Streaming Availability
      </h2>
      <div className="mb-5">
        <label
          htmlFor="query"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content Title
        </label>
        <input
          id="query"
          name="query"
          placeholder="e.g., Inception or Breaking Bad"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue="movie"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
        </select>
      </div>
      <div className="mb-5">
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Country
        </label>
        <select
          id="country"
          name="country"
          defaultValue="IN"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="IN">India</option>
          <option value="US">USA</option>
          <option value="GB">UK</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md"
      >
        Search
      </button>
    </form>
  );
}
