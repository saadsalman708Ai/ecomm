import React from 'react';
import { ShoppingBag } from 'lucide-react';

/**
 * BRANDING CONFIGURATION
 * ----------------------------------------------------
 * You can easily update your logo, text, or full logo image here.
 */

// 1. Logo Text
export const LOGO_TEXT = "Buy It";

// 2. Logo Icon (used when SHOW_LOGO_ICON is true)
export const LogoIcon = () => (
  <ShoppingBag size={20} className="md:w-6 md:h-6" />
);

// 3. Logo Image URL (used when SHOW_LOGO_IMAGE is true)
// (e.g. "/logo.png" or "https://example.com/logo.png")
export const LOGO_IMAGE_URL: string = "";

// ----------------------------------------------------
// LOGO COMBINATIONS & DISPLAY SETTINGS
// ----------------------------------------------------
// You can mix and match these by setting them to true or false.
// Examples:
// - icon + text: SHOW_LOGO_ICON = true, SHOW_LOGO_TEXT = true, SHOW_LOGO_IMAGE = false
// - image + text: SHOW_LOGO_IMAGE = true, SHOW_LOGO_TEXT = true, SHOW_LOGO_ICON = false
// - image only: SHOW_LOGO_IMAGE = true, SHOW_LOGO_TEXT = false, SHOW_LOGO_ICON = false
export const SHOW_LOGO_IMAGE = false;
export const SHOW_LOGO_ICON = true;
export const SHOW_LOGO_TEXT = true;

// ----------------------------------------------------
// SIDEBAR LOGO DISPLAY SETTINGS
// ----------------------------------------------------
// Separate settings for how the logo appears in the sidebar
export const SHOW_SIDEBAR_LOGO_IMAGE = false;
export const SHOW_SIDEBAR_LOGO_ICON = false;
export const SHOW_SIDEBAR_LOGO_TEXT = true;


