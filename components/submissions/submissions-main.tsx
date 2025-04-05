"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Edit, ExternalLink } from "lucide-react";

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

export const SubmissionsMain = () => {
  const { data: resources } = useQuery({
    queryKey: ["user-resources"],
    queryFn: async () => {
      return getUserResources().then((res) => res.data);
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
            {resources && resources.length == 0 ? (
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
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Tags</TableHead>
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources?.map((resource: ResourceType) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          {resource.title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {resource.resourceType}
                        </TableCell>
                        <TableCell>{resource.categoryName}</TableCell>
                        <TableCell>
                          {resource?.tags?.length == 0 ? (
                            <p>no tags available</p>
                          ) : (
                            resource.tags.map((tag: string) => (
                              <Badge key={tag} className="mr-2">
                                {tag}
                              </Badge>
                            ))
                          )}
                        </TableCell>
                        <TableCell>{formatDate(resource.createdAt)}</TableCell>
                        {/* <TableCell>{renderStatusBadge(submission.status)}</TableCell> */}
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={resource.url}
                                target="_blank"
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
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};
