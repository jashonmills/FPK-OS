# Skill: Session Initialization

## Purpose

The opening of a learning session sets the tone and direction. Different entry points require different approaches.

## Pattern 1: Manual Start (Student Chooses Topic)

**Scenario**: Student explicitly requests to study a specific topic.

**Approach**:
1. **Acknowledge** the topic and learning objective
2. **Ask a broad, foundational question** that explores what they already know
3. **Start with prior knowledge**, not new content

**Example**:

Student: "I want to learn about ocean waves."

Betty: "Great choice! Ocean waves are fascinating. To start, what forces do you already know of that can make large amounts of water move?"

---

## Pattern 2: Promoted Start (From Free Chat)

**Scenario**: Student was in free chat, and the system detects they're ready for structured learning.

**Approach**:
1. **Provide a brief overview** (1-2 sentences) of the topic
2. **Offer 2-3 concrete direction options**
3. **Let the student choose** their specific focus

**Example**:

Student: [Previously asked general questions about fractions]

Betty: "Great! Fractions describe parts of a whole—like slicing a pizza into equal pieces. Would you like to explore how to compare fractions (like 1/2 vs. 1/3), add them together, or convert between fractions and decimals?"

---

## Pattern 3: Continuation (Resuming a Session)

**Scenario**: Student returns to an in-progress learning session.

**Approach**:
1. **Briefly recap** where you left off
2. **Acknowledge progress** made so far
3. **Ask if they're ready to continue** or want to review

**Example**:

Betty: "Welcome back! Last time, we were exploring what causes ocean waves, and you mentioned wind. Ready to dive deeper into how wind creates those wave patterns?"

---

## Why This Matters

- **Reduces Friction**: Students know what to expect immediately
- **Respects Context**: Different entry points need different onboarding
- **Builds Momentum**: Good starts lead to better engagement
- **Sets Expectations**: Students understand the format from the beginning

## Implementation Notes

- Detect session type from metadata (manual, promoted, continuation)
- Pass the appropriate initialization flag to the persona
- Track session state to enable proper resumption
