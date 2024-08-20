"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { EchoValidation } from "@/lib/validations/echo";
import { createEcho, editEcho } from "@/lib/actions/echo.actions";
import { analyzeSentiment } from "@/lib/algo/sentiment"; // Import sentiment analysis function

interface Props {
  userId: string;
  echoId?: string;
  echoText?: string;
}

function PostEcho({ userId, echoId, echoText }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof EchoValidation>>({
    resolver: zodResolver(EchoValidation),
    defaultValues: {
      echo: echoText || "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof EchoValidation>) => {
    try {
      const sentiment = await analyzeSentiment(values.echo);
      console.log("Sentiment Analysis Result: ", sentiment); // Check sentiment result
  
      if (echoId && echoText) {
        // Ensure user authorization on the backend before allowing edits
        await editEcho({
          echoId,
          text: values.echo,
          sentiment, // Include sentiment when editing
          path: pathname,
        });
        toast.success("Echo edited successfully!");
      } else {
        // Ensure user authorization on the backend before allowing creation
        await createEcho({
          text: values.echo,
          author: userId,
          communityId: organization ? organization.id : null,
          sentiment, // Include sentiment when creating
          path: pathname,
        });
        toast.success("Echo created successfully!");
      }
  
      router.push("/");
    } catch (error) {
      console.error("Error while creating or editing Echo: ", error); // Log error for debugging
      toast.error("Failed to save Echo. Please try again.");
    }
  };
  

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            border: "1px solid white",
          },
        }}
      />
      <Form {...form}>
        <form
          className="mt-10 flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="echo"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea
                    rows={15}
                    {...field}
                    maxLength={500} // Set a maximum length to prevent buffer overflow
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            {echoId ? "Edit" : "Create"} Echo
          </Button>
        </form>
      </Form>
    </>
  );
}

export default PostEcho;


