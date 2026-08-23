"use client";

import React, { useState } from "react";

export function ProtectedEmail() {
 const [showEmail, setShowEmail] = useState(false);

 const handleClick = (e: React.MouseEvent) => {
 e.preventDefault();
 setShowEmail(true);
 };

 if (showEmail) {
 const user = "hello";
 const domain = "rahuldhole.com";
 const address = `${user}@${domain}`;
 return (
 <a 
 href={`mailto:${address}`} 
 className="text-primary hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors"
 >
 {address}
 </a>
 );
 }

 return (
 <button 
 onClick={handleClick}
 className="text-primary hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors underline decoration-dashed underline-offset-4 bg-primary/10 px-2 py-0.5 rounded"
 >
 Click to reveal email
 </button>
 );
}
