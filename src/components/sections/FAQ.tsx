"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useEventDates } from "@/lib/event-dates";
import { useCmsSection } from "@/lib/cms/use-cms";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const eventDates = useEventDates();
  const { content, isVisible } = useCmsSection("faq");

  const faqItems = useMemo(() => {
    return content.items.map((item) => {
      if (item.useDynamicDates) {
        const isDefault =
          eventDates.run1Date === "REVEALING SOON" && eventDates.run2Date === "REVEALING SOON";
        if (!isDefault) {
          return {
            ...item,
            answer: `The series features three milestone runs: Run 1 — AWAKEN (${eventDates.run1Date}), Run 2 — RESTORE (${eventDates.run2Date}), and Run 3 — CELEBRATE (${eventDates.run3Date}). You can participate in individual runs or register for the complete Trilogy Pass.`,
          };
        }
      }
      return item;
    });
  }, [content.items, eventDates]);

  if (!isVisible) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#FFFFFF] py-20 md:py-24 lg:py-32 border-t border-[#304B38]/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* LEFT COLUMN - HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[35%] flex flex-col"
          >
            <h2 className="text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-medium leading-[1.05] text-[#171717] tracking-tight mb-5">
              {content.heading} <br />
              <span className="text-[#304B38] italic font-serif">
                {content.highlightedHeading}
              </span>
            </h2>

            <p className="text-[#171717]/70 text-[15px] md:text-[16px] leading-[1.6] max-w-[380px] font-light">
              {content.subtitle}
            </p>
          </motion.div>

          {/* RIGHT COLUMN - ACCORDION */}
          <div className="w-full lg:w-[65%] flex flex-col">
            <div className="border-t border-[#171717]/15">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="border-b border-[#171717]/15"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-start justify-between py-6 lg:py-7 text-left group cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4 md:gap-6 w-[85%] sm:w-[90%]">
                        <span
                          className={`text-[12px] md:text-[13px] font-mono tracking-[0.1em] mt-[3px] transition-colors duration-300 ${
                            isOpen ? "text-[#C69A3A] font-bold" : "text-[#8C6A43]"
                          }`}
                        >
                          {item.order}
                        </span>
                        <span
                          className={`text-[15px] sm:text-[16px] md:text-[17px] font-bold tracking-tight leading-[1.4] transition-colors duration-300 ${
                            isOpen
                              ? "text-[#304B38]"
                              : "text-[#171717] group-hover:text-[#304B38]"
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>

                      <div className="flex-shrink-0 mt-1 transition-transform duration-300 text-[#171717]/70 group-hover:text-[#304B38]">
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 pl-[38px] md:pl-[52px] flex">
                            <div className="w-[1px] bg-[#304B38]/20 mr-4 md:mr-6 flex-shrink-0" />
                            <p className="text-[15px] md:text-[16px] text-[#171717]/75 leading-[1.7] font-light max-w-[560px]">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 bg-[#FAF8F5] border border-[#304B38]/15 rounded-[4px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
            >
              <div>
                <h3 className="text-[11px] font-bold tracking-[0.18em] text-[#8C6A43] uppercase mb-1">
                  {content.contactHeading}
                </h3>
                <p className="text-[14px] md:text-[15px] text-[#171717]/80 font-medium">
                  {content.contactText}
                </p>
              </div>
              <a
                href={`mailto:${content.contactEmail}`}
                className="group flex-shrink-0 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#171717] hover:text-[#304B38] uppercase transition-colors"
              >
                <span>[ EMAIL US</span>
                <span className="text-[#C69A3A] group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
                <span>]</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
