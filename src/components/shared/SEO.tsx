import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SEO = ({ title, description, keywords }: Props) => {
  const shopName = "OUR UHS E-Comm";
  const author = "saad salman 708";
  
  // Clean title for browser tab
  const finalTitle = title 
    ? `${title} - ${shopName}`
    : shopName;

  const defaultKeywords = "saadsalman708, saad salman 708, our uhs e-comm, store, online shopping, ecommerce";
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const finalDescription = description || "Welcome to OUR UHS E-Comm. Developed by saad salman 708.";

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};
