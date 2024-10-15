const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Annoucements</h1>
        <span className="text-xs text-gray">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-prodigySkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Perferendis ea asperiores doloremque recusandae.
          </p>
        </div>
        <div className="bg-prodigyPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            nemo placeat dignissimos nobis nam voluptas,
          </p>
        </div>
        <div className="bg-prodigyYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            harum consectetur esse vero quas repellat ullam pariatur,
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
