1. create a model for summary & Reminders
2. save summaries as well userid, createdAt, summary Text, type
3. user engagement service instead of history processor
4. meal instead of messages
5. meal services query to ditch loooping and querying
6. config based defaults

reminders on what basis ?

// doubts
1. all meals ?
2. how and where to test changes in models and services overall implementation


// 
const messageCount = await messageService.messageCountByUserPerPeriod(
      userId,
      new DateUtils().subtractDays(1).toDate(),
      new Date()
    );
export const messageCountByUserPerPeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    Logger("messageCountByUserPerPeriod").debug("");
    const messages = await RecievedMessage.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return messages.length;
  } catch (error) {
    Logger("messageCountByUserPerPeriod").error(error);
    throw error;
  }
};