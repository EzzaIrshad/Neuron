"use client";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const RootFaqs = () => {

    const faqs = [
        {
            id: "item-1",
            question: "What is Neuron?",
            answer: "Neuron is a cloud storage service that lets you back up, access, edit, share, and sync your files from any device. You can also convert in real-time with DNA, Graphene and Brain Signals.",
        },
        {
            id: "item-2",
            question: "How much storage do I get with a free account?",
            answer: "With a free account, you get 1 GB of cloud storage to securely store and access your files.",
        },
        {
            id: "item-3",
            question: "Can I buy more storage?",
            answer: "Yes, you can purchase additional storage plans to expand your cloud storage capacity. Neuron offers various plans to suit your needs.",
        },
        {
            id: "item-4",
            question: "What security features come with Neuron?",
            answer: "Neuron employs advanced security measures, including end-to-end encryption, and regular security audits to protect your data.",
        },
        {
            id: "item-5",
            question: "What is Personal Vault?",
            answer: "Personal Vault is a secure area within Neuron where you can store your most sensitive files. It provides an extra layer of security with two-factor authentication and encryption.",
        },
        {
            id: "item-6",
            question: "What devices can I backup to Neuron?",
            answer: "You can back up files from your computer, smartphone, tablet, and other devices to Neuron. It supports Windows, macOS, iOS, and Android platforms.",
        },

    ]

    // const [activeFAQ, setActiveFAQ] = useState<string | null>("item-1");
    const [expandedItems, setExpandedItems] = useState<string[]>(["item-1"]);

    const expandAll = () => {
        setExpandedItems(faqs.map(faq => faq.id));
    }

    const collapseAll = () => {
        setExpandedItems([]);
    }
    return (
        <div id="faq" className="w-full mt-35">
            <div className="container mx-auto px-15 ">
                <div className="flex flex-col gap-14">
                    <div className="flex justify-between items-center sm:px-10 max-lg:flex-col max-lg:gap-10">
                        <h2 className="text-[#121211] text-[clamp(1.8rem,5vw,2.5rem)] font-bold">Frequently asked questions</h2>
                        <div className="flex gap-3">
                            <button onClick={expandAll}
                                className="px-4 py-3 border border-[#121211] rounded-lg text-[#121211] hover:bg-[#121211] hover:text-white transition-colors">Expand all</button>
                            <button onClick={collapseAll} className="px-4 py-3 border border-[#121211] rounded-lg text-[#121211] hover:bg-[#121211] hover:text-white transition-colors">Collapse all</button>
                        </div>
                    </div>

                    <div className="sm:px-15">

                        <Accordion
                            type="multiple"
                            className="w-full"
                            value={expandedItems}
                            onValueChange={ setExpandedItems}
                        >

                            {
                                faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={faq.id} className=" !border-b !border-[#E5E5E5] pb-2">
                                        <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-balance">
                                            <p>
                                                {faq.answer}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))
                            }
                        </Accordion>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RootFaqs