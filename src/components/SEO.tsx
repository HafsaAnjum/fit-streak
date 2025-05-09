
import React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "FitTrack - Your Personal Fitness Companion",
  description = "Track your workouts, monitor your progress, and reach your fitness goals with FitTrack.",
  keywords = "fitness, workout, health, tracking, exercise, goals, fitness app",
  ogImage = "/og-image.png",
  ogUrl = window.location.href,
}) => {
  // Generate canonical URL
  const canonical = ogUrl || window.location.href;
  
  // Format title to ensure brand is included
  const formattedTitle = title.includes("FitTrack") ? title : `${title} | FitTrack`;

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical link */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Mobile viewport optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Color theme */}
      <meta name="theme-color" content="#8B5CF6" />
    </Helmet>
  );
};

export default SEO;
