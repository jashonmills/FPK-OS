import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  X,
  GripVertical,
  Plus,
  Settings,
  Video,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";

const initialLessons = [
  { id: "lesson-1", title: "Introduction to Biology", type: "video" as const },
  { id: "lesson-2", title: "Chapter 1: The Cell", type: "text" as const },
  { id: "lesson-3", title: "Quiz: The Cell", type: "quiz" as const },
];

const reorder = (list: typeof initialLessons, start: number, end: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(start, 1);
  result.splice(end, 0, removed);
  return result;
};

export const CourseBuilder: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [lessons, setLessons] = useState(initialLessons);
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = reorder(lessons, result.source.index, result.destination.index);
    setLessons(items);
  };

  const renderContentEditor = () => {
    switch (selectedLesson.type) {
      case "video":
        return (
          <div className="rounded-lg bg-slate-100 p-6 text-center">
            <Video className="mx-auto h-16 w-16 text-slate-400" />
            <p className="mt-4 font-semibold">Video Content Editor</p>
            <p className="text-sm text-slate-500">
              Upload video, add transcripts, and configure playback.
            </p>
          </div>
        );
      case "text":
        return (
          <div className="rounded-lg bg-slate-100 p-6">
            <Textarea
              placeholder="Start writing your lesson content here..."
              className="h-64 bg-white"
            />
          </div>
        );
      case "quiz":
        return (
          <div className="rounded-lg bg-slate-100 p-6 text-center">
            <HelpCircle className="mx-auto h-16 w-16 text-slate-400" />
            <p className="mt-4 font-semibold">Quiz Builder</p>
            <p className="text-sm text-slate-500">
              Add questions, set answers, and define scoring.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fade-in">
      <header className="flex h-16 flex-shrink-0 items-center justify-between bg-slate-900 px-6 text-white shadow-md">
        <h2 className="text-lg font-semibold">Course Authoring Studio</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="text-slate-900">
            Save Draft
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700">
            Publish Course
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <aside className="flex w-1/4 flex-col border-r border-slate-200 bg-slate-50">
          <div className="border-b p-4">
            <h3 className="font-semibold">Course Structure</h3>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-grow overflow-y-auto"
                >
                  {lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson.id}
                      draggableId={lesson.id}
                      index={index}
                    >
                      {(prov, snapshot) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`m-2 flex cursor-pointer items-center rounded-md p-3 transition-all ${
                            selectedLesson.id === lesson.id
                              ? "bg-primary-100 text-primary-800 shadow-sm"
                              : "bg-white hover:bg-slate-100"
                          } ${snapshot.isDragging ? "shadow-lg" : "shadow-sm"}`}
                        >
                          <GripVertical className="mr-2 h-5 w-5 text-slate-400" />
                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="border-t p-2">
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Lesson
            </Button>
          </div>
        </aside>

        <main className="flex w-1/2 flex-grow overflow-y-auto p-6">
          <div className="w-full">
            <h2 className="mb-4 text-2xl font-bold">{selectedLesson.title}</h2>
            {renderContentEditor()}
          </div>
        </main>

        <aside className="w-1/4 space-y-6 overflow-y-auto border-l border-slate-200 bg-slate-50 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base font-semibold">
                <Settings className="mr-2 h-4 w-4" /> Course Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Course Title" defaultValue="New Biology Course" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="ela">ELA</SelectItem>
                </SelectContent>
              </Select>
              <div className="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center text-sm text-slate-500 transition hover:border-primary-400">
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                Click to upload course image
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base font-semibold">
                <Settings className="mr-2 h-4 w-4" /> Lesson Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Lesson Title"
                value={selectedLesson.title}
                onChange={(e) =>
                  setSelectedLesson({ ...selectedLesson, title: e.target.value })
                }
              />
              <Select
                value={selectedLesson.type}
                onValueChange={(value) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    type: value as "text" | "video" | "quiz",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Lesson Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Lesson</SelectItem>
                  <SelectItem value="video">Video Lesson</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};
