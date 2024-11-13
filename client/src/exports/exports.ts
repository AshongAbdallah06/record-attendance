import { createContext, Dispatch, SetStateAction } from "react";

export interface StudentType {
	fullName: string;
	indexNumber: string;
	time: Date;
	long: number;
	lat: number;
}

interface ContextType {
	studentList: StudentType[] | [];
	setStudentList: Dispatch<SetStateAction<StudentType[] | []>>;
}

export type SignInType = {
	courseId: string | null;
	courseName: string | null;
	fullName: string | null;
};
export const ContextProvider = createContext<ContextType | undefined>(undefined);
