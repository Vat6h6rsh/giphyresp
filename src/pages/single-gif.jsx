import { useEffect, useState } from "react";  // Importing useEffect and useState hooks from React
import { useParams } from "react-router-dom"; // Importing useParams hook from React Router
import { GifState } from "../context/gif-context"; // Importing GifState context
import Gif from "../components/gif"; // Importing the Gif component
import FollowOn from "../components/follow-on"; // Importing the FollowOn component

import { HiOutlineExternalLink } from "react-icons/hi"; // Importing an icon component from react-icons
import { HiMiniChevronDown, HiMiniChevronUp, HiMiniHeart } from "react-icons/hi2"; // Importing some more icon components
import { FaPaperPlane } from "react-icons/fa6"; // Importing another icon component
import { IoCodeSharp } from "react-icons/io5"; // Importing yet another icon component

const contentType = ["gifs", "stickers", "texts"]; // Defining an array of content types

const GifPage = () => { // Defining the GifPage component
  const { type, slug } = useParams(); // Using the useParams hook to get the parameters from the URL
  const [gif, setGif] = useState({}); // Declaring state for the gif
  const [relatedGifs, setRelatedGifs] = useState([]); // Declaring state for related gifs
  const [readMore, setReadMore] = useState(false); // Declaring state to track read more/less

  const { gf, addToFavorites, favorites } = GifState(); // Using the GifState context to get necessary functions and data

  useEffect(() => { // Using the useEffect hook to perform side effects
    if (!contentType.includes(type)) { // Checking if the type is valid
      throw new Error("Invalid Content Type"); // Throwing an error if the type is invalid
    }
    const fetchGif = async () => { // Defining an async function to fetch gif data
      const gifId = slug.split("-"); // Extracting gif ID from the slug
      const { data } = await gf.gif(gifId[gifId.length - 1]); // Fetching gif data
      const { data: related } = await gf.related(gifId[gifId.length - 1], { // Fetching related gifs
        limit: 10,
      });
      setGif(data); // Updating the gif state
      setRelatedGifs(related); // Updating the related gifs state
    };

    fetchGif(); // Calling the fetchGif function
  }, []); // Dependency array is empty, so it runs only once when the component mounts

  const shareGif = () => {
    // Placeholder function for sharing gif
  };

  const EmbedGif = () => {
    // Placeholder function for embedding gif
  };

  return (
    <div className="grid grid-cols-4 my-10 gap-4"> {/* A grid container with 4 columns */}
      <div className="hidden sm:block"> {/* A block visible only on small screens and above */}
        {gif?.user && ( // Conditional rendering if the user exists
          <>
            <div className="flex gap-1"> {/* Flex container with gap */}
              <img
                src={gif?.user?.avatar_url} // Avatar image of the user
                alt={gif?.user?.display_name} // Alt text for the image
                className="h-14" // Height of the image
              />
              <div className="px-2"> {/* Padding */}
                <div className="font-bold">{gif?.user?.display_name}</div> {/* Display name of the user */}
                <div className="faded-text">@{gif?.user?.username}</div> {/* Username of the user */}
              </div>
            </div>
            {gif?.user?.description && ( // Conditional rendering if user description exists
              <p className="py-4 whitespace-pre-line text-sm text-gray-400"> {/* Styling for user description */}
                {readMore // Conditional rendering for showing more or less of the description
                  ? gif?.user?.description
                  : gif?.user?.description.slice(0, 100) + "..."}
                <div
                  className="flex items-center faded-text cursor-pointer" // Styling for the "Read more/less" button
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? ( // Conditional rendering for "Read less" or "Read more" text
                    <>
                      Read less <HiMiniChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Read more <HiMiniChevronDown size={20} />
                    </>
                  )}
                </div>
              </p>
            )}
          </>
        )}
        <FollowOn /> {/* Component for following */}

        <div className="divider" /> {/* Divider element */}

        {gif?.source && ( // Conditional rendering if source exists
          <div>
            <span
              className="faded-text" // Styling for source text
            >
              Source
            </span>
            <div className="flex items-center text-sm font-bold gap-1"> {/* Styling for source link */}
              <HiOutlineExternalLink size={25} /> {/* External link icon */}
              <a href={gif.source} target="_blank" className="truncate"> {/* Source link */}
                {gif.source}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-4 sm:col-span-3"> {/* Spanning 4 columns on small screens and above */}
        <div className="flex gap-6"> {/* Flex container with gap */}
          <div className="w-full sm:w-3/4"> {/* Taking full width on small screens and 3/4 width on larger screens */}
            <div className="faded-text truncate mb-2">{gif.title}</div> {/* Title of the gif */}
            <Gif gif={gif} hover={false} /> {/* Displaying the gif */}

            {/* Mobile UI */}
            <div className="flex sm:hidden gap-1"> {/* Flex container for mobile UI */}
              <img
                src={gif?.user?.avatar_url} // Avatar image of the user
                alt={gif?.user?.display_name} // Alt text for the image
                className="h-14" // Height of the image
              />
              <div className="px-2"> {/* Padding */}
                <div className="font-bold">{gif?.user?.display_name}</div> {/* Display name of the user */}
                <div className="faded-text">@{gif?.user?.username}</div> {/* Username of the user */}
              </div>

              <button className="ml-auto" onClick={shareGif}> {/* Share button */}
                <FaPaperPlane size={25} /> {/* Paper plane icon */}
              </button>
            </div>
            {/* Mobile UI */}
          </div>

          <div className="hidden sm:flex flex-col gap-5 mt-6"> {/* Flex container hidden on small screens */}
            <button
              onClick={() => addToFavorites(gif.id)} // Add to favorites button
              className="flex gap-5 items-center font-bold text-lg" // Styling for the button
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gif.id) ? "text-red-500" : "" // Conditional styling based on whether gif is favorited
                }`}
              />
              Favorite
            </button>
            <button
              onClick={shareGif} // Share button
              className="flex gap-6 items-center font-bold text-lg" // Styling for the button
            >
              <FaPaperPlane size={25} /> {/* Paper plane icon */}
              Share
            </button>
            <button
              onClick={EmbedGif} // Embed button
              className="flex gap-5 items-center font-bold text-lg" // Styling for the button
            >
              <IoCodeSharp size={30} /> {/* Code icon */}
              Embed
            </button>
          </div>
        </div>

        <div> {/* Container for related gifs */}
          <span className="font-extrabold">Related GIFs</span> {/* Title for related gifs */}
          <div className="columns-2 md:columns-3 gap-2"> {/* Grid for related gifs */}
            {relatedGifs.slice(1).map((gif) => ( // Mapping through related gifs and displaying them
              <Gif gif={gif} key={gif.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifPage; // Exporting the GifPage component
