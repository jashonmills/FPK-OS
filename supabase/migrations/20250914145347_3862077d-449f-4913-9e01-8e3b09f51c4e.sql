-- Create comprehensive content blocks for Lesson 2: Economic Systems and the Role of Money
-- Lesson ID: afda7193-f388-48df-8658-39b669921255

INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json, created_at, updated_at) VALUES

-- Block 1: Learning Objectives for Lesson 2
('afda7193-f388-48df-8658-39b669921255', 1, 'rich-text', '{
  "html": "<div class=\"bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500 mb-6\"><h2 class=\"text-2xl font-bold text-green-900 mb-4\">🎯 Learning Objectives</h2><p class=\"text-green-800 mb-4\">By the end of this lesson, you will be able to:</p><ul class=\"list-disc list-inside space-y-2 text-green-800\"><li><strong>Describe the characteristics</strong> of traditional, command, and market economies</li><li><strong>Explain why all modern economies</strong>, including Ireland''s, are mixed economies</li><li><strong>Identify the functions of money</strong> as a medium of exchange, unit of account, and store of value</li></ul></div>"
}'::jsonb, now(), now()),

-- Block 2: Economic Systems Introduction
('afda7193-f388-48df-8658-39b669921255', 2, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h2 class=\"text-3xl font-bold text-gray-900 mb-6\">🌍 How Societies Organize: Economic Systems</h2><p class=\"text-lg text-gray-700 mb-4\">Different societies organize themselves in unique ways to answer three fundamental economic questions:</p><div class=\"grid md:grid-cols-3 gap-6 my-6\"><div class=\"bg-blue-50 border border-blue-200 rounded-lg p-4\"><h4 class=\"font-semibold text-blue-800 mb-2\">❓ What to produce?</h4><p class=\"text-blue-700 text-sm\">Which goods and services should be created?</p></div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-4\"><h4 class=\"font-semibold text-purple-800 mb-2\">🔧 How to produce?</h4><p class=\"text-purple-700 text-sm\">What methods and resources should be used?</p></div><div class=\"bg-orange-50 border border-orange-200 rounded-lg p-4\"><h4 class=\"font-semibent text-orange-800 mb-2\">👥 For whom to produce?</h4><p class=\"text-orange-700 text-sm\">Who gets the goods and services?</p></div></div></div>"
}'::jsonb, now(), now()),

-- Block 3: Three Economic Systems
('afda7193-f388-48df-8658-39b669921255', 3, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">📊 Three Types of Economic Systems</h3><div class=\"space-y-6\"><div class=\"bg-amber-50 border-l-4 border-amber-400 p-6\"><h4 class=\"text-lg font-semibold text-amber-800 mb-3\">🏺 Traditional Economy</h4><p class=\"text-amber-700 mb-2\">Economic decisions are based on customs and traditions passed down through generations.</p><p class=\"text-amber-600 text-sm\"><strong>Examples:</strong> Rural agricultural communities, some indigenous societies</p></div><div class=\"bg-red-50 border-l-4 border-red-400 p-6\"><h4 class=\"text-lg font-semibold text-red-800 mb-3\">🏛️ Command Economy</h4><p class=\"text-red-700 mb-2\">All economic decisions are made by a central government authority.</p><p class=\"text-red-600 text-sm\"><strong>Examples:</strong> Soviet Union (historically), North Korea</p></div><div class=\"bg-blue-50 border-l-4 border-blue-400 p-6\"><h4 class=\"text-lg font-semibold text-blue-800 mb-3\">🏪 Market Economy</h4><p class=\"text-blue-700 mb-2\">Economic decisions are made by individuals and firms with little government intervention. Driven by private property, competition, and the profit motive (capitalism).</p><p class=\"text-blue-600 text-sm\"><strong>Key Features:</strong> Private ownership, free competition, profit incentive</p></div></div></div>"
}'::jsonb, now(), now()),

-- Block 4: Ireland as Mixed Economy
('afda7193-f388-48df-8658-39b669921255', 4, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">🇮🇪 Ireland: A Mixed Economy in Action</h3><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-6\"><p class=\"text-emerald-800 mb-4\">In reality, no economy exists at either the \"free market\" or \"command\" extreme. All modern economies, including Ireland''s, are considered <strong>mixed economies</strong> that combine elements of both systems.</p><div class=\"grid md:grid-cols-2 gap-4 mt-4\"><div><h5 class=\"font-semibold text-emerald-800 mb-2\">🏢 Market Elements in Ireland:</h5><ul class=\"text-emerald-700 text-sm space-y-1\"><li>• Private businesses and entrepreneurship</li><li>• Competitive markets</li><li>• Foreign direct investment</li><li>• Stock market (Irish Stock Exchange)</li></ul></div><div><h5 class=\"font-semibold text-emerald-800 mb-2\">🏛️ Government Role in Ireland:</h5><ul class=\"text-emerald-700 text-sm space-y-1\"><li>• HSE (Health Service Executive)</li><li>• Public roads and transportation</li><li>• Social welfare programs</li><li>• Semi-state bodies (ESB, Bus Éireann)</li></ul></div></div></div></div>"
}'::jsonb, now(), now()),

-- Block 5: Functions of Money
('afda7193-f388-48df-8658-39b669921255', 5, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h3 class=\"text-2xl font-bold text-gray-900 mb-4\">💰 Understanding Money: More Than Just Cash</h3><p class=\"text-gray-700 mb-4\">To understand how these economic systems work, we must first understand money. Money serves three key functions:</p><div class=\"grid md:grid-cols-3 gap-4 my-6\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\"><h4 class=\"font-semibold text-indigo-800 mb-2\">🔄 Medium of Exchange</h4><p class=\"text-indigo-700 text-sm\">A widely accepted item that buyers use to pay for goods and services</p></div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-4\"><h4 class=\"font-semibold text-purple-800 mb-2\">📏 Unit of Account</h4><p class=\"text-purple-700 text-sm\">A common measure of the value of goods and services</p></div><div class=\"bg-pink-50 border border-pink-200 rounded-lg p-4\"><h4 class=\"font-semibold text-pink-800 mb-2\">🏦 Store of Value</h4><p class=\"text-pink-700 text-sm\">Can be saved and retrieved later, maintaining purchasing power over time</p></div></div></div>"
}'::jsonb, now(), now()),

-- Block 6: Interactive Activity Setup
('afda7193-f388-48df-8658-39b669921255', 6, 'rich-text', '{
  "html": "<div class=\"prose max-w-none\"><h4 class=\"text-xl font-bold text-gray-900 mb-4\">🎯 Interactive Activity: Making a Purchase Without Money</h4><div class=\"bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6\"><h5 class=\"text-lg font-semibold text-yellow-800 mb-3\">Scenario:</h5><p class=\"text-yellow-700 mb-3\">Imagine you want to buy a coffee, but you live in a world without money. You only have a bicycle to trade. The coffee shop owner doesn''t want your bicycle—they need flour for baking.</p><p class=\"text-yellow-700 mb-3\">Now you need to find someone who wants your bicycle AND has flour to trade. But what if the person with flour wants shoes, not a bicycle? This creates a chain of trades that can become very complicated!</p><p class=\"text-yellow-600 text-sm\"><strong>This demonstrates why we need money as a medium of exchange.</strong></p></div></div>"
}'::jsonb, now(), now()),

-- Block 7: Lesson 2 Quiz
('afda7193-f388-48df-8658-39b669921255', 7, 'quiz', '{
  "title": "🧠 Economic Systems & Money Quiz",
  "instructions": "Test your understanding of economic systems and the functions of money."
}'::jsonb, now(), now());