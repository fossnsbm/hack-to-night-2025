import { useParams } from 'next/navigation';

const TopicPage = () => {
  const params = useParams();
  const topicId = params.id;

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold">Topic {topicId}</h1>
      <p>This is the challenge page for Topic {topicId}.</p>
    </div>
  );
};

export default TopicPage;