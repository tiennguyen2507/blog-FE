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
import QuillViewer from "@/components/ui/QuillViewer";
import dynamic from "next/dynamic";
import { Avatar } from "@/components/ui/avatar";

const MyEditor = dynamic(() => import("@/components/ui/MyEditor"), {
  ssr: false,
});

interface Post {
  _id: string;
  title: string;
  description: string;
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

export default function AuthPage() {
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
    <div className="space-y-4 p-2">
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
        <DialogContent className="rounded-2xl p-0 max-w-2xl w-full shadow-2xl animate-fadeIn">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-1">
                {editingPost ? "Cập nhật bài viết" : "Tạo bài viết mới"}
              </DialogTitle>
              <p className="text-muted-foreground text-sm mb-4">
                {editingPost
                  ? "Chỉnh sửa nội dung và tiêu đề bài viết."
                  : "Điền thông tin để tạo bài viết mới."}
              </p>
            </DialogHeader>
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
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postList.data.map((post) => (
              <li
                key={post._id}
                className="border rounded-xl p-3 sm:p-4 bg-white shadow-sm flex flex-col relative group transition hover:shadow-md"
              >
                <div className="font-bold text-base sm:text-lg mb-1 line-clamp-1 text-gray-900">
                  {post.title}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {post.createdBy && (
                    <Avatar>
                      {post.createdBy.avatar ? (
                        <img
                          src={post.createdBy.avatar}
                          alt={
                            post.createdBy.firstName +
                            " " +
                            post.createdBy.lastName
                          }
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-gray-400" />
                      )}
                    </Avatar>
                  )}
                  <span className="text-sm text-gray-700 font-medium">
                    {post.createdBy
                      ? `${post.createdBy.firstName || ""} ${
                          post.createdBy.lastName || ""
                        }`.trim()
                      : ""}
                  </span>
                </div>
                <QuillViewer
                  html={post.description}
                  className="text-sm text-muted-foreground mb-2 line-clamp-3 max-h-[60px] overflow-hidden"
                />
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-1 sm:gap-2 text-xs text-gray-500 mt-auto">
                    <span>
                      Status:{" "}
                      <span
                        className={
                          post.status ? "text-green-600" : "text-red-600"
                        }
                      >
                        {post.status ? "Active" : "Inactive"}
                      </span>
                    </span>
                    <span>
                      Created:{" "}
                      {new Date(post.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <button
                      className="p-2 rounded-full bg-white shadow hover:bg-red-100 active:bg-red-200"
                      title="Xoá bài viết"
                      onClick={() => handleDelete(post._id)}
                    >
                      <Trash size={20} />
                    </button>
                    <button
                      className="p-2 rounded-full bg-white shadow hover:bg-blue-100 active:bg-blue-200"
                      title="Sửa bài viết"
                      onClick={() => {
                        setEditingPost(post);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(null);
    try {
      if (post) {
        await httpRequest.patch(`/posts/${post._id}`, { title, description });
        setMessage("Cập nhật bài viết thành công!");
        setIsSuccess(true);
      } else {
        await httpRequest.post("/posts", { title, description });
        setMessage("Tạo bài viết thành công!");
        setIsSuccess(true);
        setTitle("");
        setDescription("");
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
    <form className="space-y-5" onSubmit={handleSubmit}>
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
        <label className="block mb-1 font-semibold text-base">Mô tả</label>
        <div className="rounded-lg border focus-within:ring-2 focus-within:ring-primary/60 focus-within:border-primary transition">
          <MyEditor value={description} onChange={setDescription} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
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
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 font-semibold shadow hover:bg-primary/90 transition"
          disabled={loading || !title.trim() || !description.trim()}
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
    </form>
  );
}
