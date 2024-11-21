// const useUserAgent = () => {
//   const getUserAgent = () => {
//     return typeof window !== 'undefined' && window.navigator.userAgent;
//   };

//   const [userAgent, setUserAgent] = React.useState(getUserAgent());

//   React.useEffect(() => {
//     const handleUserAgentChange = () => {
//       setUserAgent(getUserAgent());
//     };

//     window.addEventListener('resize', handleUserAgentChange);

//     return () => {
//       window.removeEventListener('resize', handleUserAgentChange);
//     };
//   }, []);

//   return userAgent;
// };

import { useState, useEffect } from "react";

const useDeviceDetect = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
        const mobile = Boolean(userAgent.match(/Mobi|Android|Blackberry|iPhone/i))

        setIsMobile(mobile)
    }, [])

    return isMobile
}

export default useDeviceDetect