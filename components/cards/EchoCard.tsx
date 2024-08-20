import Image from "next/image";
import Link from "next/link";
import { formatDateString } from "@/lib/utils";
import DeleteEcho from "../forms/DeleteEcho";
import EditEcho from "../atoms/EditEcho";
import ReactEcho from "../atoms/ReactEcho";
import { link } from "fs";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  reactions: {
    image: string;
    _id: string;
    id: string;
    name: string;
    username: string;
  }[];
  sentiment?: string; // Optional sentiment prop for future sentiment analysis
  isComment?: boolean;
  reactState?: boolean;
}

function EchoCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  reactions,
  sentiment = "neutral",  // Ensure a fallback to neutral if sentiment isn't provided
  isComment,
  reactState,
}: Props) {
  

  // Map sentiment to color
  const sentimentColor = sentiment === "positive"
    ? "bg-green-500"
    : sentiment === "negative"
    ? "bg-red-500"
    : "bg-gray-400";  // Default neutral color

  return (
    <article
      className={`relative flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <ReactEcho
                  echoId={id}
                  currentUserId={currentUserId}
                  interactState={reactState}
                  parentId={parentId}
                  isComment={isComment}
                />
                <Link href={`/echo/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              <div className="flex flex-row gap-2">
                {isComment && (
                  <>
                    {comments.length > 0 && (
                      <Link href={`/echo/${id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                          {comments.length}{" "}
                          {comments.length > 1 ? "replies" : "reply"}
                        </p>
                      </Link>
                    )}

                    {comments.length > 0 && reactions.length > 0 && (
                      <p className="mt-1 text-subtle-medium text-gray-1">•</p>
                    )}

                    {reactions.length > 0 && (
                      <Link href={`/echo/reactions/${id}`}>
                        <p className="mt-1 text-subtle-medium text-gray-1">
                          {reactions.length}{" "}
                          {reactions.length > 1 ? "likes" : "like"}
                        </p>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <DeleteEcho
            echoId={JSON.stringify(id)}
            currentUserId={currentUserId}
            authorId={author.id}
            parentId={parentId}
            isComment={isComment}
          />
          <EditEcho
            echoId={JSON.stringify(id)}
            currentUserId={currentUserId}
            authorId={author.id}
          />
        </div>
      </div>

      <div className="flex flex-row gap-2">
        {!isComment && (
          <>
            {comments.length > 0 && (
              <div className="ml-1 mt-3 flex items-center gap-2">
                {comments.slice(0, 2).map((comment, index) => (
                  <Image
                    key={index}
                    src={comment.author.image}
                    alt={`user_${index}`}
                    width={24}
                    height={24}
                    className={`${index !== 0 && "-ml-5"
                      } rounded-full object-cover`}
                  />
                ))}

                <Link href={`/echo/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length}{" "}
                    {comments.length > 1 ? "replies" : "reply"}
                  </p>
                </Link>
              </div>
            )}

            {/* {comments.length > 0 && reactions.length > 0 && (
              <div className="ml-1 mt-3 flex items-center">
                <p className="mt-1 text-subtle-medium text-gray-1">•</p>
              </div>
            )} */}

            {reactions.length > 0 && (
              <div className="ml-1 mt-3 flex items-center gap-2">
                {reactions.slice(0, 2).map((reaction, index) => (
                  <Image
                    key={index}
                    src={reaction.image}
                    alt={`user_${index}`}
                    width={24}
                    height={24}
                    className={`${index !== 0 && "-ml-5"
                      } rounded-full object-cover`}
                  />
                ))}

                <Link href={`/echo/reactions/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {reactions.length} {reactions.length > 1 ? "likes" : "like"}
                  </p>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Placeholder dot in bottom-right corner */}
      <div className="echo-sentiment absolute bottom-3 right-3">
        <div className="inline-flex items-center">
          <span
            className={`inline-block w-4 h-4 rounded-full ${sentimentColor}`}
            title={sentiment} // Shows the sentiment type when hovered
          />
        </div>
      </div>

      <div className="mt-5 flex items-center">
        <p className="text-subtle-medium text-gray-1">
          {formatDateString(createdAt)}
          {community && ` - ${community.name} Community`}
        </p>

        {community && (
          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        )}
      </div>
    </article>
  );
}

export default EchoCard;
