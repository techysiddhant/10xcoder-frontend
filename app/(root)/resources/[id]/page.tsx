import React from "react";

import { ResourceMain } from "@/components/resource/resource-main";

const ResourcePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ResourceMain id={id} />;
};

export default ResourcePage;
