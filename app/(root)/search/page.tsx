import React, { Suspense } from "react";

import { SearchMain } from "@/components/search/search-main";

const SearchPage = () => {
  return (
    <div className="container mx-auto px-4 pb-16">
      <Suspense>
        <SearchMain />
      </Suspense>
    </div>
  );
};

export default SearchPage;
