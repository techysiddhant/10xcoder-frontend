import { Suspense } from "react";

import { ResourceMain } from "@/components/resources/resource-main";

const ResourcesPage = () => {
  return (
    <div className="container mx-auto px-4 pb-16">
      <Suspense>
        <ResourceMain />
      </Suspense>
    </div>
  );
};

export default ResourcesPage;
