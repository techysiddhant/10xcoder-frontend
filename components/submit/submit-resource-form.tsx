"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Image, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const queryClient = new QueryClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetchData<CategoryType[]>(`${env.NEXT_PUBLIC_API_URL}/categories`),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(submitResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      resourceType: "video",
      categoryName: "",
      tags: "",
    },
  });
  useEffect(() => {
    if (initialData && categories?.length) {
      form.setValue("title", initialData.title);
      form.setValue("description", initialData?.description || "");
      form.setValue("url", initialData.url);
      form.setValue("resourceType", initialData.resourceType);
      form.setValue("tags", initialData.tags.join(","));
      form.setValue("categoryName", initialData.categoryName);
      if (initialData.image) {
        setThumbnailPreview(
          `${env.NEXT_PUBLIC_API_URL}/resources/${initialData.image}`
        );
      }
    }
  }, [initialData, categories]);
  const clearThumbnail = () => {
    form.setValue("image", undefined);
    setThumbnailPreview(null);

    // Clear the file input
    const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
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
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.[0]) {
      const file = e.target.files[0];

      // Check file type
      if (
        !file.type.startsWith("image/") ||
        !file.type.match(/image\/(jpeg|jpg|png)/)
      ) {
        toast.error(
          "Invalid file type jpeg, jpg, or png. Please upload an image."
        );
        return;
      }

      // Check file size (max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 2MB.");
        return;
      }

      // Set the file in form data
      form.setValue("image", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <Card className="glass-card">
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
                  name="categoryName"
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
                        <SelectContent defaultValue={field.value}>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
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
                            className="h-48 w-full rounded-md border object-cover"
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
                          <label
                            htmlFor="thumbnail"
                            className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image className="mb-3 h-10 w-10 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG or GIF (Max 5MB)
                              </p>
                            </div>
                            <input
                              id="thumbnail"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailChange}
                              {...field}
                            />
                          </label>
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
                  type="submit"
                  disabled={mutation.isPending || mutateR.isPending}
                >
                  {mutation.isPending || mutateR.isPending ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <div className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="mr-2" />
                      <span>
                        {initialData ? "Update Resource" : "Submit Resource"}
                      </span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
