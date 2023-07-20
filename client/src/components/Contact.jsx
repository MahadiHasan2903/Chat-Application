import Avatar from "./Avatar";

const Contact = ({ id, username, onClick, selected, online }) => {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={`border-b border-black-300 flex items-center gap-2 cursor-pointer text-lg ${
        selected ? "bg-sky-700 " : ""
      }`}
    >
      {selected && <div className="w-1 bg-gray-100 h-12 rounded-r-md"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} />
        <span className="text-white">{username}</span>
      </div>
    </div>
  );
};

export default Contact;
