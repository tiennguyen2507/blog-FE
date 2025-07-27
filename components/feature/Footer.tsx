import React from "react";
import { Facebook, Youtube, Instagram, Twitter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
        <p className="text-gray-300 mb-8 text-lg">
          The latest news, articles, and resources, sent to your inbox weekly.
        </p>

        <div className="mx-auto mb-8">
          <div className="flex gap-3  ">
            <Input type="email" placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </div>

        <div className=" w-full pt-8">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Facebook size={24} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Youtube size={24} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Instagram size={24} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Twitter size={24} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
