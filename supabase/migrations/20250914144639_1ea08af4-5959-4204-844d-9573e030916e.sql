-- Create comprehensive content blocks for Lesson 1: The Economic Way of Thinking
-- Lesson ID: 348c792e-9c44-474c-98d0-c2e80c3d23c2

INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json, created_at, updated_at) VALUES

-- Block 1: Learning Objectives
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 1, 'rich-text', '{
  "html": "<div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6\"><h2 class=\"text-2xl font-bold text-blue-900 mb-4\">📚 Learning Objectives</h2><p class=\"text-blue-800 mb-4\">By the end of this lesson, you will be able to:</p><ul class=\"list-disc list-inside space-y-2 text-blue-800\"><li><strong>Define scarcity</strong> and explain why it is the fundamental economic problem</li><li><strong>Articulate the concept of opportunity cost</strong> and apply it to personal and societal decisions</li><li><strong>Understand rational decision-making</strong> by weighing marginal benefits and costs</li><li><strong>Demonstrate how institutions and property rights</strong> affect economic incentives and growth</li></ul></div>"
}', now(), now()),

-- Block 2: Introduction to Economics
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 2, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h2 class=\"text-3xl font-bold text-gray-900 mb-6\">🎯 What is Economics Really About?</h2><p class=\"text-lg text-gray-700 mb-4\">At its heart, <strong>economics is the study of scarcity</strong>. This isn''t just about a lack of money. Scarcity applies to everything: time, natural resources, even human capital. Because our wants are unlimited and our resources are limited, we are constantly forced to make choices, and every choice comes with a trade-off.</p><div class=\"bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6\"><p class=\"text-yellow-800\"><strong>🤔 Think About It:</strong> Right now, you''re choosing to study economics instead of doing something else. What are you giving up to be here?</p></div></div>"
}', now(), now()),

-- Block 3: Opportunity Cost Deep Dive
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 3, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">⚖️ Opportunity Cost: The Heart of Every Decision</h3><p class=\"text-gray-700 mb-4\">This trade-off is known as <strong>opportunity cost</strong>—the foregone benefit of the next best alternative when a choice is made.</p><div class=\"bg-green-50 border border-green-200 rounded-lg p-6 my-6\"><h4 class=\"text-lg font-semibold text-green-800 mb-3\">🍎 Real-World Example</h4><p class=\"text-green-700\">If you spend an hour studying for an economics exam, the opportunity cost is the time you could have spent watching a film or earning money at a part-time job. Every decision, from what to buy for lunch to how the government spends tax revenue, has an opportunity cost.</p></div></div>"
}', now(), now()),

-- Block 4: Quiz on Opportunity Cost
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 4, 'quiz', '{
  "title": "🧠 Quick Check: Opportunity Cost",
  "instructions": "Test your understanding of opportunity cost with this quick quiz."
}', now(), now()),

-- Block 5: Rational Decision Making
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 5, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">🧠 How Do People Really Make Decisions?</h3><p class=\"text-gray-700 mb-4\">Economists assume that people act with <strong>rational decision-making</strong> by weighing the <em>marginal benefits</em> (the additional satisfaction from one more unit) against the <em>marginal costs</em> (the additional cost of one more unit). This framework helps explain why people make the choices they do.</p><div class=\"bg-blue-50 border border-blue-200 rounded-lg p-6 my-6\"><h4 class=\"text-lg font-semibold text-blue-800 mb-3\">🎯 Key Concept: Thinking at the Margin</h4><p class=\"text-blue-700\">When you''re deciding whether to eat one more slice of pizza, you don''t think about the total benefits of all pizza—you think about whether that <em>next slice</em> is worth the cost. That''s marginal thinking!</p></div></div>"
}', now(), now()),

-- Block 6: Production Possibilities Curve
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 6, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">📊 Visualizing Choices: The Production Possibilities Curve</h3><p class=\"text-gray-700 mb-4\">A powerful tool for visualizing these concepts is the <strong>Production Possibilities Curve (PPC)</strong>. This model shows the maximum combination of two goods that can be produced with full employment and efficiency.</p><div class=\"grid md:grid-cols-2 gap-6 my-6\"><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-4\"><h4 class=\"font-semibold text-purple-800 mb-2\">📍 Points ON the curve</h4><p class=\"text-purple-700\">Represent efficiency - using all resources optimally</p></div><div class=\"bg-orange-50 border border-orange-200 rounded-lg p-4\"><h4 class=\"font-semibold text-orange-800 mb-2\">📍 Points INSIDE the curve</h4><p class=\"text-orange-700\">Represent inefficiency or unemployment</p></div></div><div class=\"bg-red-50 border border-red-200 rounded-lg p-4 my-4\"><h4 class=\"font-semibold text-red-800 mb-2\">📍 Points OUTSIDE the curve</h4><p class=\"text-red-700\">Currently unattainable given available resources</p></div></div>"
}', now(), now()),

-- Block 7: Irish Bakery PPC Example
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 7, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h4 class=\"text-xl font-bold text-gray-900 mb-4\">🥖 Irish Bakery Example</h4><div class=\"bg-emerald-50 border-l-4 border-emerald-400 p-6 my-6\"><p class=\"text-emerald-800 mb-3\"><strong>Scenario:</strong> Imagine a small Irish bakery that can produce only two things: scones and soda bread.</p><p class=\"text-emerald-700 mb-3\">The PPC would show the different combinations they could produce in a day. If they focus entirely on scones, they might make 100 scones and 0 loaves of soda bread. If they focus entirely on soda bread, they might make 0 scones and 50 loaves.</p><p class=\"text-emerald-700\"><strong>Growth:</strong> If they get a new, more efficient oven, the entire PPC would shift outwards, showing that they can now produce more of both goods.</p></div></div>"
}', now(), now()),

-- Block 8: Property Rights Activity Setup
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 8, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">🏛️ The Role of Institutions and Property Rights</h3><p class=\"text-gray-700 mb-4\">Institutions and property rights fundamentally affect economic incentives and growth. When people can securely own property and know their rights will be enforced, they''re more likely to invest, save, and be productive.</p><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-6\"><h4 class=\"text-lg font-semibold text-indigo-800 mb-3\">🎯 Interactive Activity: ''You''re the Economist''</h4><p class=\"text-indigo-700 mb-3\">Let''s analyze data from a hypothetical frontier settlement to understand how clearly defined and well-enforced property rights affect incentives for production and exchange.</p><p class=\"text-indigo-600 text-sm\">This activity provides a tangible, real-world connection between an abstract principle and its impact on economic growth.</p></div></div>"
}', now(), now()),

-- Block 9: Final Quiz for Lesson 1
('348c792e-9c44-474c-98d0-c2e80c3d23c2', 9, 'quiz', '{
  "title": "🎓 Lesson 1 Assessment: Economic Way of Thinking",
  "instructions": "Complete this comprehensive quiz to test your understanding of fundamental economic concepts."
}', now(), now());