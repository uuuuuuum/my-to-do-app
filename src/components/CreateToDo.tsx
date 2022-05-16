import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
    toDo: string;
}

function CreateToDo() {
    const setToDos = useSetRecoilState(toDoState);
    const category = useRecoilValue(categoryState);

    const { register, handleSubmit, setValue, formState:{ errors } } = useForm<IForm>();
    const handleValid = ({ toDo }: IForm) => {
        setToDos(oldToDos => {
            window.localStorage.setItem("ourLocalItems", JSON.stringify([
                { text: toDo, id: Date.now(), category: category },
                ...oldToDos]));
            return [
                { text: toDo, id: Date.now(), category: category },
                ...oldToDos
            ]
        });
        setValue("toDo", "");
    }

    return (
        <form onSubmit={handleSubmit(handleValid)}>
            <label htmlFor="todo">To Do</label>
            <input id="todo" {...register("toDo", {
                required: "Please wirte a To Do",
            })} placeholder="Write a to do" />
            <button>Add</button>
            <span>{errors?.toDo?.message}</span>
        </form>
    );
}

export default CreateToDo;