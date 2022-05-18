import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, categoryTextState, isShowLabelState, toDoState } from "../atoms";

interface IForm {
    toDo: string;
}

function CreateToDo() {
    const setToDos = useSetRecoilState(toDoState);
    const category = useRecoilValue(categoryState);
    const categoryText = useRecoilValue(categoryTextState);
    const { register, handleSubmit, setValue, formState:{ errors } } = useForm<IForm>();

    //Label Show true false
    const isShowLabel = useRecoilValue(isShowLabelState);

    const handleValid = ({ toDo }: IForm) => {
        setToDos(oldToDos => {
            // 로컬스토리지에 데이터 담기 => 투두리스트용
            window.localStorage.setItem("toDoitems", JSON.stringify([
                { text: toDo, id: Date.now(), category: category, categoryText: categoryText },
                ...oldToDos]));
            return [
                { text: toDo, id: Date.now(), category: category, categoryText: categoryText },
                ...oldToDos
            ]
        });
        setValue("toDo", "");
    }

    return (
        <form onSubmit={handleSubmit(handleValid)}>
            { isShowLabel ? <label htmlFor="todo">To Do</label> : null }
            <input id="todo" {...register("toDo", {
                required: "Please wirte a To Do",
            })} placeholder="Write a to do" />
            <button>Add</button>
            <span>{errors?.toDo?.message}</span>
        </form>
    );
}

export default CreateToDo;