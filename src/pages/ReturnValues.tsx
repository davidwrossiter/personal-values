import { useLocation } from "react-router-dom";
import ValuesRenderer from "../components/ValuesRenderer";
import { useEffect } from "react";
import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function ReturnValues() {
  const location = useLocation();
  const { checkedItems } = location.state || {};
  const [llmResponse, setLlmResponse] = useState<any>(null);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const handleRegenerate = () => {
    setReload(!reload);
    setLlmResponse(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://personal-values-worker.davyrossiter.workers.dev/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words: checkedItems }),
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(data.response);
      console.log(llmResponse);

      setLlmResponse(data.response);
    };

    fetchData(); // Call the fetchData function immediately
  }, [checkedItems, reload]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col overflow-hidden px-10 pt-16 lg:px-40">
        <h1 className="text-[48px] leading-[48px] pb-4">
          Check out your values
        </h1>
        <p className="mb-4 leading-5 max-w-[600px]">
          If you don’t like the grouping of the words, click "Try again" to
          regenerate groupings with the same words.
        </p>
        {llmResponse ? (
          <ValuesRenderer data={llmResponse} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="w-full px-10 lg:px-40 pb-16 pt-8 flex flex-row justify-end">
        <button
          className="bg-[#0B0B0B] mr-2 rounded-lg px-4 py-[6px] text-white"
          onClick={handleClick}
        >
          Go back
        </button>
        <button
          className="bg-[#0B0B0B] rounded-lg px-4 py-[6px] text-white"
          onClick={handleRegenerate}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default ReturnValues;
