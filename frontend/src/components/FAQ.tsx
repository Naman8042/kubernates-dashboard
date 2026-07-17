// const faqs = [
//   {
//     question: "What is KubeChatOps and how does it work?",
//     answer:
//       "KubeChatOps is a Kubernetes ChatOps platform that enables teams to manage and monitor Kubernetes clusters directly from chat applications like Telegram, Discord, and Slack. It uses a secure WebSocket-based architecture where lightweight agents deployed inside Kubernetes clusters communicate with a centralized control plane.",
//   },
//   {
//     question: "Can I use KubeChatOps with multiple Kubernetes clusters?",
//     answer:
//       "Yes! KubeChatOps supports multiple Kubernetes clusters. The number of clusters depends on your plan - Starter includes 1 cluster, Pro includes 5, and Enterprise offers unlimited clusters.",
//   },
//   {
//     question: "What chat platforms are supported?",
//     answer:
//       "KubeChatOps currently supports Telegram, Discord, and Slack. Enterprise plans also offer custom integration options for other chat platforms.",
//   },
//   {
//     question: "Is my data secure?",
//     answer:
//       "Yes, we take security seriously. All communications are encrypted via WebSocket with TLS. Agents authenticate using unique cluster tokens, and we follow the principle of least privilege with Kubernetes RBAC.",
//   },
//   {
//     question: "Can I upgrade or downgrade my plan?",
//     answer:
//       "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll only be charged for the new plan's prorated amount.",
//   },
//   {
//     question: "What kind of support do you offer?",
//     answer:
//       "We offer community support for Starter plans, priority support for Pro plans, and 24/7 dedicated support for Enterprise plans. All plans include access to our documentation and knowledge base.",
//   },
// ];
// const FAQItem = ({ question, answer, isOpen, onToggle }) => {
//   return (
//     <div className="border-b border-slate-200 py-4">
//       <button
//         onClick={onToggle}
//         className="flex w-full items-center justify-between text-left"
//       >
//         <span className="font-semibold text-slate-900">{question}</span>
//         {isOpen ? <Minus size={20} /> : <Plus size={20} />}
//       </button>
//       {isOpen && <p className="mt-2 text-slate-600">{answer}</p>}
//     </div>
//   );
// };

// export default function FAQ() {
//   return (
//     <section className="border-t bg-white py-16">
//       <div className="mx-auto max-w-3xl px-4">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-slate-900">
//             Frequently Asked Questions
//           </h2>
//           <p className="mt-2 text-slate-600">
//             Everything you need to know about KubeChatOps
//           </p>
//         </div>
//         <div className="mt-8">
//           {faqs.map((faq, index) => (
//             <FAQItem
//               key={index}
//               {...faq}
//               isOpen={faqOpen === index}
//               onToggle={() => toggleFAQ(index)}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
