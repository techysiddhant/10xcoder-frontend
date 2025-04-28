"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Clock, Edit, ExternalLink, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserResources } from "@/lib/http";
import { ResourceType } from "@/lib/types";

import { SubmissionPagination } from "./submission-pagination";

export const SubmissionsMain = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const { data: resourcesData } = useQuery({
    queryKey: ["user-resources", page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page);
      return getUserResources(params.toString()).then((res) => res.data);
    },
  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            <Check size={14} className="mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
            <X size={14} className="mr-1" /> Rejected
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
          >
            <Clock size={14} className="mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <section className="container mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8">
          <h1 className="font-display mb-2 text-4xl font-bold">
            My Submissions
          </h1>
          <p className="text-muted-foreground text-lg">
            Track the status of your submitted resources
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Submitted Resources</CardTitle>
            <CardDescription>
              Resources you&lsquo;ve shared with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resourcesData && resourcesData?.resources?.length == 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven&lsquo;t submitted any resources yet
                </p>
                <Button asChild>
                  <Link href="/submit">Submit Your First Resource</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resourcesData?.resources?.map((resource: ResourceType) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium whitespace-break-spaces">
                          {resource.title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {resource.resourceType}
                        </TableCell>
                        <TableCell className="capitalize">
                          {resource.language}
                        </TableCell>
                        <TableCell>{resource.categoryName}</TableCell>
                        <TableCell>{formatDate(resource.createdAt)}</TableCell>
                        <TableCell>
                          {renderStatusBadge(resource.status)}
                        </TableCell>
                        <TableCell>
                          {resource?.tags?.length == 0 ? (
                            <p>no tags available</p>
                          ) : (
                            resource.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                className="dark:text-secondary mr-2 text-white"
                              >
                                {tag}
                              </Badge>
                            ))
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/resources/${resource.id}`}
                                rel="noopener noreferrer"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/submit?resourceId=${resource.id}`}>
                                <Edit size={16} />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-4 flex items-center justify-end gap-2">
              <SubmissionPagination
                page={resourcesData?.page}
                limit={resourcesData?.limit}
                totalCount={resourcesData?.totalCount}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};
