#ifndef QUEUE_TS_HPP
#define QUEUE_TS_HPP

#include <queue>
#include <deque>
#include <mutex>

template<typename T, typename Sequence = std::deque<T>>
class QueueTS {
private:
	std::queue<T, Sequence> q;
	mutable std::mutex usageMutex;
	
public:
	QueueTS() = default;
	
	void push(const T& value) {
		std::unique_lock<std::mutex> lock(usageMutex);
		
		q.push(value);
	}
	
	T pop() {
		std::unique_lock<std::mutex> lock(usageMutex);
		
		T value = q.front();
		q.pop();
		return value;
	}
	
	T& front() {
		std::unique_lock<std::mutex> lock(usageMutex);
		
		return q.front();
	}
	
	std::size_t size() {
		std::unique_lock<std::mutex> lock(usageMutex);
		
		return q.size();
	}
	
	bool empty() {
		std::unique_lock<std::mutex> lock(usageMutex);
		
		return q.empty();
	}
};

#endif // QUEUE_TS_HPP
