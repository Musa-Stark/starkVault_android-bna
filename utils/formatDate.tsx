function formatDate(dateStr: Date): string {
  const date = new Date(dateStr);
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    return "Just now";
  }

  if (diff < 3600000) {
    return Math.floor(diff / 60000) + " min ago";
  }

  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + " hr ago";
  }

  if (diff < 172800000) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default formatDate;
