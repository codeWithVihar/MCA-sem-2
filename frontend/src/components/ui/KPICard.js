import React from "react";
import CountUp from "react-countup";

const colorSchemes = {
  indigo: "from-indigo-500 to-indigo-400",
  green: "from-green-500 to-green-400",
  yellow: "from-yellow-500 to-yellow-400",
  red: "from-red-500 to-red-400",
  purple: "from-purple-500 to-purple-400",
  blue: "from-blue-500 to-blue-400",
};

const KPICard = ({
  title,
  value,
  prefix = "",
  suffix = "",
  color = "indigo",
  decimals = 0,
  separator = ",",
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${colorSchemes[color]} text-white p-6 rounded-xl shadow hover:shadow-lg transition`}
    >
      <p className="text-sm text-white/80">{title}</p>
      <h3 className="text-2xl font-bold mt-1">
        {prefix}
        <CountUp
          end={value}
          duration={1.5}
          separator={separator}
          decimals={decimals}
        />
        {suffix}
      </h3>
    </div>
  );
};

export default KPICard;
