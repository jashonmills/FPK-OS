export interface SEOCheck {
  passed: boolean;
  message: string;
}

export interface SEOAnalysis {
  score: number;
  checks: {
    keywordInTitle: SEOCheck;
    keywordInFirstParagraph: SEOCheck;
    keywordInMetaDescription: SEOCheck;
    keywordDensity: SEOCheck;
    imagesHaveAlt: SEOCheck;
    hasInternalLinks: SEOCheck;
    hasExternalLinks: SEOCheck;
    contentLength: SEOCheck;
    hasSubheadings: SEOCheck;
    metaTitleLength: SEOCheck;
    metaDescriptionLength: SEOCheck;
  };
  suggestions: string[];
}

export function calculateSEOScore(
  title: string,
  metaTitle: string,
  metaDescription: string,
  content: string,
  focusKeyword: string
): SEOAnalysis {
  const checks = {
    keywordInTitle: checkKeywordInTitle(title, focusKeyword),
    keywordInFirstParagraph: checkKeywordInFirstParagraph(content, focusKeyword),
    keywordInMetaDescription: checkKeywordInMetaDescription(metaDescription, focusKeyword),
    keywordDensity: checkKeywordDensity(content, focusKeyword),
    imagesHaveAlt: checkImagesHaveAlt(content),
    hasInternalLinks: checkInternalLinks(content),
    hasExternalLinks: checkExternalLinks(content),
    contentLength: checkContentLength(content),
    hasSubheadings: checkSubheadings(content),
    metaTitleLength: checkMetaTitleLength(metaTitle),
    metaDescriptionLength: checkMetaDescriptionLength(metaDescription),
  };

  const passedChecks = Object.values(checks).filter(check => check.passed).length;
  const totalChecks = Object.values(checks).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  const suggestions: string[] = [];
  Object.entries(checks).forEach(([key, check]) => {
    if (!check.passed) {
      suggestions.push(check.message);
    }
  });

  return { score, checks, suggestions };
}

function checkKeywordInTitle(title: string, keyword: string): SEOCheck {
  const passed = title.toLowerCase().includes(keyword.toLowerCase());
  return {
    passed,
    message: passed ? 'Focus keyword found in title' : 'Add focus keyword to your title',
  };
}

function checkKeywordInFirstParagraph(content: string, keyword: string): SEOCheck {
  const firstParagraph = content.split('\n\n')[0] || '';
  const passed = firstParagraph.toLowerCase().includes(keyword.toLowerCase());
  return {
    passed,
    message: passed ? 'Focus keyword found in first paragraph' : 'Include focus keyword in the first paragraph',
  };
}

function checkKeywordInMetaDescription(metaDescription: string, keyword: string): SEOCheck {
  if (!metaDescription) {
    return { passed: false, message: 'Add a meta description with your focus keyword' };
  }
  const passed = metaDescription.toLowerCase().includes(keyword.toLowerCase());
  return {
    passed,
    message: passed ? 'Focus keyword found in meta description' : 'Include focus keyword in meta description',
  };
}

function checkKeywordDensity(content: string, keyword: string): SEOCheck {
  const words = content.toLowerCase().split(/\s+/);
  const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
  const density = (keywordCount / words.length) * 100;
  const passed = density >= 0.5 && density <= 2.5;
  return {
    passed,
    message: passed
      ? `Keyword density is optimal (${density.toFixed(2)}%)`
      : `Keyword density is ${density.toFixed(2)}% (aim for 0.5-2.5%)`,
  };
}

function checkImagesHaveAlt(content: string): SEOCheck {
  const images = content.match(/!\[([^\]]*)\]/g) || [];
  const imagesWithAlt = content.match(/!\[.+\]/g) || [];
  const passed = images.length === 0 || images.length === imagesWithAlt.length;
  return {
    passed,
    message: passed ? 'All images have alt text' : 'Add descriptive alt text to all images',
  };
}

function checkInternalLinks(content: string): SEOCheck {
  const internalLinks = (content.match(/\[([^\]]+)\]\(\/[^\)]+\)/g) || []).length;
  const passed = internalLinks >= 2;
  return {
    passed,
    message: passed
      ? `${internalLinks} internal links found`
      : `Add at least 2 internal links (found ${internalLinks})`,
  };
}

function checkExternalLinks(content: string): SEOCheck {
  const externalLinks = (content.match(/\[([^\]]+)\]\(https?:\/\/[^\)]+\)/g) || []).length;
  const passed = externalLinks >= 1;
  return {
    passed,
    message: passed
      ? `${externalLinks} external links found`
      : 'Add at least 1 external authoritative link',
  };
}

function checkContentLength(content: string): SEOCheck {
  const words = content.split(/\s+/).length;
  const passed = words >= 800;
  return {
    passed,
    message: passed ? `Content length is good (${words} words)` : `Add more content (${words}/800 words)`,
  };
}

function checkSubheadings(content: string): SEOCheck {
  const headings = (content.match(/^#{2,3}\s+.+$/gm) || []).length;
  const passed = headings >= 3;
  return {
    passed,
    message: passed ? `${headings} subheadings found` : `Add more subheadings (H2, H3) for better structure`,
  };
}

function checkMetaTitleLength(metaTitle: string): SEOCheck {
  const length = metaTitle.length;
  const passed = length >= 30 && length <= 60;
  return {
    passed,
    message: passed
      ? `Meta title length is optimal (${length} chars)`
      : `Meta title should be 30-60 characters (currently ${length})`,
  };
}

function checkMetaDescriptionLength(metaDescription: string): SEOCheck {
  if (!metaDescription) {
    return { passed: false, message: 'Add a meta description (120-160 characters)' };
  }
  const length = metaDescription.length;
  const passed = length >= 120 && length <= 160;
  return {
    passed,
    message: passed
      ? `Meta description length is optimal (${length} chars)`
      : `Meta description should be 120-160 characters (currently ${length})`,
  };
}