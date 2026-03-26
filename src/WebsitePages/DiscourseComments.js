import { useEffect } from "react";

function DiscourseComments({ embedUrl }) {
  useEffect(() => {
    // Create the div where Discourse will render comments
    let discourseDiv = document.getElementById("discourse-comments");
    if (!discourseDiv) {
      discourseDiv = document.createElement("div");
      discourseDiv.id = "discourse-comments";
      document.body.appendChild(discourseDiv);
    }

    // Set meta tag for username
    let meta = document.querySelector("meta[name='discourse-username']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "discourse-username";
      meta.content = "admin"; // Replace with your Discourse username
      document.head.appendChild(meta);
    }

    // Add Discourse embed configuration
    window.DiscourseEmbed = {
      discourseUrl: "https://discourse.pakistanproperty.com/", // Discourse base URL
      discourseEmbedUrl: embedUrl, // Current page URL on your main domain
    };

    // Add the Discourse embed script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://discourse.pakistanproperty.com/javascripts/embed.js";
    document.body.appendChild(script);

    return () => {
      // Remove script on unmount to avoid duplicates
      document.body.removeChild(script);
    };
  }, [embedUrl]);

  return <div id="discourse-comments"></div>;
}

export default DiscourseComments;
