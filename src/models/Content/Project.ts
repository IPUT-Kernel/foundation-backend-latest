import mongoose from 'mongoose';

export type ProjectType = {
  name: string;
  desc: string;
  stacksId: mongoose.Types.ObjectId[];
  toolsId: mongoose.Types.ObjectId[];
  membersId: mongoose.Types.ObjectId[];
};

const ProjectSchema = new mongoose.Schema<ProjectType>({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 64,
  },
  desc: {
    type: String,
    required: true,
    min: 1,
    max: 512,
  },
  stacksId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stack',
    },
  ],
  toolsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool',
    },
  ],
  membersId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Project = mongoose.model<ProjectType>('Project', ProjectSchema);

export default Project;