export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-teal-400",
    "bg-red-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-blue-400",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-pink-400",
    "bg-fuchsia-400",
    "bg-rose-400",
  ];

  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={`w-8 h-8 relative rounded-full flex items-center ${color}`}>
      <div className="text-center text-black w-full opacity-70">
        {username[0]}
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}
