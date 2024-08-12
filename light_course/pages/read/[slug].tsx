import Newsletter from "@/components/Newsletter";
import { FaChevronLeft, FaComments, FaFileAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { posts } from "@/data/posts";
import { type Posts } from "@/type";

export async function getStaticProps(context: { params: { slug: string } }) {
  const { slug } = context.params;

  const post = posts.find(item =>
    item.title.toLowerCase().trim().split(" ").join("-") === slug
  );

  return {
    props: {
      post: post ? JSON.stringify(post) : null,
    },
  };
}

export async function getStaticPaths() {
  const paths = posts.map(item => ({
    params: { slug: item.title.toLowerCase().trim().split(" ").join("-") },
  }));

  return {
    paths,
    fallback: false,
  };
}

function Read({ post }: { post: string }) {
  const [showChatBar, setShowChatBar] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const toggleChatBar = () => {
    setShowChatBar(!showChatBar);
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  if (!post) {
    return <p>Post not found</p>;
  }

  let singlePost: Posts = JSON.parse(post);

  return (
    <>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="flex flex-col justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose lg:prose-xl prose-stone dark:prose-invert">
            <div className="my-4 flex items-center justify-between">
              <Link className="text-xl flex flex-row items-center mb-6 no-underline" href={`/`}>
                <FaChevronLeft /> Back
              </Link>

              <Link href={singlePost.vid_des} passHref>
                <button
                  className="mt-4 p-3 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center"
                  title="Open Transcript"
                >
                  View Image
                </button>
              </Link>

              <Link href={singlePost.vid_des} passHref>
                <button
                  className="mt-4 p-3 bg-yellow-600 text-white rounded-full shadow-lg flex items-center justify-center"
                  title="Open Transcript"
                >
                  Extra course material
                </button>
              </Link>

              <Link className="text-xl mb-6 no-underline" href={`/tags/${singlePost.tags[0].trim().toLowerCase().replaceAll(' ', '-')}`}>
                More on this course ({singlePost.tags[0]})
              </Link>
            </div>

            <h1 className="mb-4 mt-4 text-3xl font-extrabold text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {singlePost.title}
            </h1>
            <div className="mt-4">
              <iframe
                src={`https://player.thetavideoapi.com/video/${singlePost.url}`}
                width="100%"
                height="440px"
              />
            </div>

            <button
              onClick={toggleTranscript}
              className="mt-4 p-3 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center"
              title={showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            >
              <FaFileAlt size={24} />
            </button>

            {showTranscript && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {singlePost.description}
                </h1>
              </div>
            )}

            <button
              onClick={toggleChatBar}
              className="fixed bottom-20 right-20 p-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
              title={showChatBar ? 'Close Chat' : 'Open Chat'}
            >
              <FaComments size={24} />
            </button>

            {showChatBar && (
              <div className="fixed bottom-20 right-40 w-[400px] h-[600px] bg-white shadow-lg border rounded-lg">
                <iframe
                  src="https://gemini-chat-eight-bice.vercel.app/"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                />
              </div>
            )}
          </article>
        </div>
      </main>
    </>
  );
}

export default Read;
