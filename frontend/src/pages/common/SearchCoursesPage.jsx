import { useState } from "react";
import CourseCard from "../../components/cards/CourseCard";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import { useCourses } from "../../hooks/useCourses";

const SearchCoursesPage = () => {
  const { searchResults, searchTitle, searchInstructor, loading } = useCourses();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState(null);

  const handleSearchTitle = () => {
    if (query.trim()) {
      setSearchType('title');
      searchTitle(query.trim());
    }
  };

  const handleSearchInstructor = () => {
    if (query.trim()) {
      setSearchType('instructor');
      searchInstructor(query.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearchTitle();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Search Courses</h2>

      <div className="flex gap-2 flex-wrap">
        <input
          className="flex-1 transform-gpu rounded-md bg-white/90 px-3 py-2.5 text-sm text-slate-900 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.10)] transition-[box-shadow,background-color] duration-300 placeholder:text-slate-400 focus:outline-none focus:shadow-[0_6px_20px_-10px_rgba(15,23,42,0.14)] dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.50)] dark:focus:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.60)]"
          placeholder="Search by title or instructor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <Button onClick={handleSearchTitle} disabled={!query.trim() || loading}>
          By Title
        </Button>

        <Button variant="secondary" onClick={handleSearchInstructor} disabled={!query.trim() || loading}>
          By Instructor
        </Button>
      </div>

      {loading && <Loader />}

      {!loading && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      ) : (
        !loading && searchType && (
          <EmptyState title="No courses found" description="Try a different query" />
        )
      )}
    </div>
  );
};

export default SearchCoursesPage;
