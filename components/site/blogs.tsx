"use client";
import { useFetchData } from "@/lib/useFetchData";
import {
  Loader,
  Trash,
  Pencil,
  User,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import httpRequest from "@/lib/httpRequest";
import dynamic from "next/dynamic";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UploadFile from "@/components/ui/UploadFile";
import Link from "next/link";
import Image from "next/image";
import ClientHtmlViewer from "@/components/ui/ClientHtmlViewer";

const MyEditor = dynamic(() => import("@/components/ui/MyEditor"), {
  ssr: false,
});

interface Post {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  nextPage: boolean;
  prePage: boolean;
}

export default function BlogsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const {
    data: postList,
    loading,
    error,
    refetch,
  } = useFetchData<PostListResponse>("/posts", {
    params: { page: 1, limit: 10 },
  });

  let errorMessage: string | null = null;
  if (error) {
    if (typeof error === "string") errorMessage = error;
    else if (error instanceof Error) errorMessage = error.message;
    else errorMessage = "Error loading posts.";
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;
    try {
      await httpRequest.delete(`/posts/${id}`);
      refetch();
    } catch {
      alert("Xoá bài viết thất bại!");
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Blog List pages</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Here are the authentication-related pages. These now live in their own
          full-screen layout.
        </p>
      </div>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingPost(null);
          setDialogOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div className="flex justify-end mb-4">
            <Button
              variant="default"
              className="md:w-auto w-full flex items-center gap-2 font-semibold shadow-lg"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Tạo bài viết
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          className="rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] shadow-2xl animate-fadeIn flex flex-col"
          style={{ maxHeight: "90vh" }}
        >
          {/* Fixed Header */}
          <div className="p-6 pb-4 border-b border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-1">
                {editingPost ? "Cập nhật bài viết" : "Tạo bài viết mới"}
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                {editingPost
                  ? "Chỉnh sửa nội dung và tiêu đề bài viết."
                  : "Điền thông tin để tạo bài viết mới."}
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <PostForm
              post={editingPost || undefined}
              onSuccess={() => {
                setDialogOpen(false);
                setEditingPost(null);
                refetch();
              }}
              onCancel={() => {
                setDialogOpen(false);
                setEditingPost(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg md:text-xl font-semibold">Posts</h2>
          <span className="text-xs text-muted-foreground">
            Total: {postList?.total || 0} | Page: {postList?.page || 1} /{" "}
            {postList ? Math.ceil(postList.total / postList.limit) : 1}
          </span>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-blue-500 animate-spin-slow justify-center py-4">
            <Loader className="animate-spin" />
            <span>Loading posts...</span>
          </div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-center py-2">
            Error loading posts: {errorMessage}
          </div>
        )}
        {postList && postList.data && postList.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postList.data.map((post) => (
              <article
                key={post._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Clickable area for post details */}
                <Link href={`/blogs/${post._id}`} className="block">
                  <div className="cursor-pointer">
                    {/* Thumbnail */}
                    {post.thumbnail ? (
                      <div className="relative md:h-48 h-32 overflow-hidden">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-gray-400 text-sm font-medium">
                            No Image
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      {/* Date */}
                      <div className="text-sm text-gray-500 mb-3">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight min-h-[45px]">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <div className="text-sm text-gray-600 mb-1 line-clamp-3 leading-relaxed min-h-[77px]">
                        <ClientHtmlViewer
                          html={post.description}
                          className="text-sm text-gray-600 line-clamp-3"
                        />
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          {post.createdBy && (
                            <>
                              <Avatar className="w-8 h-8">
                                {post.createdBy.avatar ? (
                                  <AvatarImage
                                    src={post.createdBy.avatar}
                                    alt={`${post.createdBy.firstName} ${post.createdBy.lastName}`}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    <User className="w-5 h-5 text-gray-400" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {`${post.createdBy.firstName || ""} ${
                                    post.createdBy.lastName || ""
                                  }`.trim() || "Anonymous"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {post.status ? "Active" : "Inactive"}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="p-4 pt-0">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="w-8 h-8 flex-1 bg-red-50 text-red-600 border border-red-200 px-2 py-2 rounded-[50%] text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(post._id);
                              }}
                            >
                              <Trash size={16} />
                            </button>
                            <button
                              className="w-8 h-8 flex-1 bg-blue-50 text-blue-600 border border-blue-200 px-2 py-2 rounded-[50%] text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingPost(post);
                                setDialogOpen(true);
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center text-muted-foreground py-8">
              No posts found.
            </div>
          )
        )}
      </div>
    </div>
  );
}

function PostForm({
  post,
  onSuccess,
  onCancel,
}: {
  post?: Post;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(
    undefined
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    post?.thumbnail
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(null);
    try {
      let thumbnail = thumbnailUrl;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("folder", "thumbnails");
        const res = await httpRequest.post("/image/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        thumbnail = res.data?.secure_url || res.data?.url;
        setThumbnailUrl(thumbnail);
      }

      if (post) {
        await httpRequest.patch(`/posts/${post._id}`, {
          title,
          description,
          thumbnail,
        });
        setMessage("Cập nhật bài viết thành công!");
        setIsSuccess(true);
      } else {
        await httpRequest.post("/posts", { title, description, thumbnail });
        setMessage("Tạo bài viết thành công!");
        setIsSuccess(true);
        setTitle("");
        setDescription("");
        setThumbnailUrl(undefined);
        setThumbnailFile(undefined);
      }
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      let msg = post ? "Cập nhật bài viết thất bại!" : "Tạo bài viết thất bại!";
      if (err && typeof err === "object" && "message" in err) {
        msg += ` ${(err as { message?: string }).message}`;
      }
      setMessage(msg);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pb-20">
      <div className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-base">Tiêu đề</label>
          <div className="relative">
            <input
              className="border rounded-lg w-full py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition disabled:bg-gray-100 placeholder:text-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="Nhập tiêu đề bài viết..."
              maxLength={120}
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-base">
            Thumbnail
          </label>
          <UploadFile onChange={setThumbnailFile} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-base">Mô tả</label>
          <div className="rounded-lg border focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary transition">
            <MyEditor value={description} onChange={setDescription} />
          </div>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 justify-center text-sm mt-2 font-medium ${
              isSuccess === true
                ? "text-green-600"
                : isSuccess === false
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {isSuccess === true ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isSuccess === false ? (
              <XCircle className="w-5 h-5" />
            ) : null}
            {message}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition font-medium"
            onClick={onCancel}
            disabled={loading}
          >
            <XCircle className="w-5 h-5" />
            Huỷ
          </button>
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 font-semibold shadow hover:bg-primary/90 transition"
            disabled={loading || !title.trim() || !description.trim()}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader className="animate-spin w-5 h-5" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : post ? (
              <Pencil className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {loading
              ? post
                ? "Đang cập nhật..."
                : "Đang tạo..."
              : post
              ? "Cập nhật bài viết"
              : "Tạo bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
}
