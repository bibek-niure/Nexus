import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import EchoCard from "@/components/cards/EchoCard";
import Pagination from "@/components/shared/Pagination";

import { fetchPosts, getReactionsData } from "@/lib/actions/echo.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch posts with sentiments
  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  // Fetch reactions data for posts
  const reactionsData = await getReactionsData({
    userId: userInfo._id,
    posts: result.posts,
  });

  const { childrenReactions, childrenReactionState } = reactionsData;

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Echoes found</p>
        ) : (
          <>
            {result.posts.map((post, idx) => (
              <EchoCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                reactions={childrenReactions[idx].users}
                reactState={childrenReactionState[idx]}
                sentiment={post.sentiment} // Pass sentiment to EchoCard
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;