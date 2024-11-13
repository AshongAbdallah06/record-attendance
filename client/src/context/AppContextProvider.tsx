import { ReactNode, useState } from "react";
import { ContextProvider, StudentType } from "../exports/exports";
import useFunctions from "../hooks/useFunctions";

const Context = ({ children }: { children: ReactNode }) => {
	const { getStorageItem } = useFunctions();

	const [studentList, setStudentList] = useState<StudentType[] | []>(
		getStorageItem("studentList", [])
	);

	return (
		<ContextProvider.Provider value={{ studentList, setStudentList }}>
			{children}
		</ContextProvider.Provider>
	);
};

export default Context;
