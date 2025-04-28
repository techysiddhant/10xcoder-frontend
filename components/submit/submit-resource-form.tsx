"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PacmanLoader from "react-spinners/PacmanLoader";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import { fetchData } from "@/lib/fetch-utils";
import { createResource, updateResource } from "@/lib/http";
import { submitResourceSchema } from "@/lib/schema";
import { CategoryType, ResourceType } from "@/lib/types";

import { UploadDropzone } from "../upload-button";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
type FormValues = z.infer<typeof submitResourceSchema>;
interface SubmitResourceFormProps {
  initialData: ResourceType | null;
}
export const SubmitResourceForm = ({
  initialData,
}: SubmitResourceFormProps) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetchData<CategoryType[]>(`${env.NEXT_PUBLIC_API_URL}/categories`),
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(submitResourceSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      resourceType: "video",
      categoryId: initialData?.categoryId || "",
      tags: initialData?.tags.join(",") || "",
      language: "english",
    },
  });
  useEffect(() => {
    if (initialData && categories && categories.length > 0) {
      if (initialData.image) {
        setThumbnailPreview(initialData.image);
      }
    }
  }, [initialData, categories]);
  const url = form.watch("url");
  useEffect(() => {
    if (!url) return;
    const fetchImage = async () => {
      try {
        setImageLoading(true);
        const response = await fetch(`https://api.microlink.io?url=${url}`);
        const data = await response.json();
        if (data?.data?.image?.url) {
          setThumbnailPreview(data.data.image.url);
          form.setValue("image", data.data.image.url);
        }
      } catch (error) {
        toast.error("Failed to fetch image. based on URL.");
      } finally {
        setImageLoading(false);
      }
    };
    if (!initialData) {
      console.log("Fetching image based on URL...");
      fetchImage();
    }
  }, [url]);
  const clearThumbnail = () => {
    form.setValue("image", undefined);
    setThumbnailPreview(null);
  };
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => createResource(data),
    onError: (error) => {
      toast.error("Failed to submit resource. Please try again.");
    },
    onSuccess: () => {
      form.reset();
      clearThumbnail();
      toast.success("Resource submitted successfully!");
      router.push("/submissions");
    },
  });
  const mutateR = useMutation({
    mutationFn: async (data: FormValues) =>
      updateResource(data, initialData?.id as string),
    onError: (error) => {
      toast.error("Failed to update resource. Please try again.");
    },
    onSuccess: () => {
      form.reset();
      clearThumbnail();
      toast.success("Resource updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["user-resources"],
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (initialData) {
      mutateR.mutate(data);
      return;
    }
    mutation.mutate(data);
  };
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-2xl"
    >
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Resource</CardTitle>
          <CardDescription>
            Share a valuable free coding resource with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/resource"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to the original resource
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="resourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        What type of resource is this?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-muted-foreground px-4 py-2 text-sm">
                              No categories found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Which category best fits this resource?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. JavaScript: Understanding the Weird Parts"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title for the resource
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a helpful description of this resource..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what makes this resource valuable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What is the language of this resource?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. javascript, react, beginner"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated tags to help categorize the resource
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imageLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <PacmanLoader color="#f59e0b" />
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <div className="flex flex-col space-y-2">
                          {thumbnailPreview ? (
                            <div className="relative">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="aspect-video w-full rounded-md border object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={clearThumbnail}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex w-full items-center justify-center">
                              <UploadDropzone
                                disabled={imageLoading || imageUploading}
                                className="ut-button:bg-primary w-full"
                                endpoint={"imageUploader"}
                                onUploadBegin={() => {
                                  setImageUploading(true);
                                }}
                                onClientUploadComplete={(res) => {
                                  setImageUploading(false);
                                  if (res && res.length > 0) {
                                    onChange(res[0].ufsUrl);
                                    toast.success(
                                      "Thumbnail uploaded successfully!"
                                    );
                                    setThumbnailPreview(res[0].ufsUrl);
                                  } else {
                                    toast.error(
                                      "Upload failed: No response received"
                                    );
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  setImageUploading(false);
                                  toast.error(`ERROR! ${error.message}`);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          Upload a thumbnail image for your resource
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end px-0">
                    <Button
                      className="text-secondary dark:text-secondary-foreground"
                      type="submit"
                      disabled={
                        mutation.isPending ||
                        mutateR.isPending ||
                        imageUploading
                      }
                    >
                      {mutation.isPending ||
                      mutateR.isPending ||
                      imageUploading ? (
                        <>
                          <span className="mr-2">
                            {imageUploading ? "Uploading..." : "Submitting..."}
                          </span>
                          <div className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          <span>
                            {initialData
                              ? "Update Resource"
                              : "Submit Resource"}
                          </span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
