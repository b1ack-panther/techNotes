import { useState, useEffect } from "react";

const usePersist = () => {
  const item = localStorage.getItem("persist");
	const [persist, setPersist] = useState(
		JSON.parse(item ?? false)
  );
  
	useEffect(() => {
		localStorage.setItem("persist", JSON.stringify(persist));
	}, [persist]);

	return [persist, setPersist];
};
export default usePersist;
