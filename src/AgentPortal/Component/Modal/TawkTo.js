import React, { useEffect } from "react";

const TawkTo = () => {
  useEffect(() => {
    // Check if script is already added
    if (!window.Tawk_API) {
      var s1 = document.createElement("script");
      s1.src = "https://embed.tawk.to/6932f5188b3d5d198125d000/1jbngqqhn";
      s1.async = true;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      document.body.appendChild(s1);
    }
  }, []);

  return null; // component me koi JSX render nahi karna
};

export default TawkTo;
