"use client";

import * as React from "react";

import { useToast } from "@/components/ui/use-toast";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
} from "@radix-ui/react-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 grid gap-1.5 relative pl-6 pr-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full"
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="font-medium text-gray-900 dark:text-white">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-sm text-gray-700 dark:text-gray-300">
                {description}
              </ToastDescription>
            )}
          </div>
          {action && (
            <ToastAction
              altText={action.altText}
              onClick={action.onClick}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 mt-2"
            >
              {action.children}
            </ToastAction>
          )}
          <ToastClose className="absolute right-2 top-2 rounded-sm p-1 text-gray-500 dark:text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none hover:text-gray-900 dark:hover:text-gray-50">
            <X className="h-4 w-4" />
          </ToastClose>
        </Toast>
      ))}
      <ToastViewport className="fixed top-4 right-4 flex flex-col p-0 gap-2 w-[380px] max-w-[calc(100%-32px)] z-[1000]" />
    </ToastProvider>
  );
}
